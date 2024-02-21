import gspread
from google.oauth2.service_account import Credentials
from dotenv import load_dotenv
import json
import os
import redis
import time

# Define the scope of the application
scope = ["https://www.googleapis.com/auth/spreadsheets", 'https://www.googleapis.com/auth/drive']
load_dotenv()
credentials_json = os.getenv("SECRET")
credentials_dict = json.loads(credentials_json)
credentials = Credentials.from_service_account_info(credentials_dict, scopes=scope)
client = gspread.authorize(credentials)

# Redis setup
redis_client = redis.Redis(host='redis', port=6379, db=0)

def update_redis():
    redis_client.flushdb() #potentially inefficient? But also makes sure that if a user is dropped from the course or something then their data isn't stored in our db
    sheet = client.open("Copy of Copy of CS10 | Sp24 | HAID").get_worksheet(0)
    categories = sheet.row_values(2)[2:] #gets the categories from row 2, starting from column C
    concepts = sheet.row_values(1)[2:] #gets the concepts from row 1, starting from column C
    max_points = sheet.row_values(3)[2:] #gets the max points from row 3, starting from column C
    
    category_scores = {}
    for category, concept, points in zip(categories, concepts, max_points):
        if category not in category_scores:
            category_scores[category] = {} #creates a hashmap entry for each category
        category_scores[category][concept] = points #nested hashmap of category:concept:points
    
    redis_client.set("Categories", json.dumps(category_scores)) #the one record that holds all of the categories info
    
    records = sheet.get_all_records()
    
    for record in records:
        email = record.pop('Email')
        legal_name = record.pop('Legal Name')
        if email == "CATEGORY":
            continue
        users_to_assignments = { #structure for db entries
            "Legal Name": legal_name,
            "Assignments": {}
        }
        
        for category, concept in zip(categories, concepts):
            key = f"{category}:{concept}"
            users_to_assignments["Assignments"][key] = record[concept]
        
        redis_client.set(email, json.dumps(users_to_assignments)) #sets key value for user:other data

if __name__ == "__main__":
    while True:
        update_redis()
        time.sleep(60)

