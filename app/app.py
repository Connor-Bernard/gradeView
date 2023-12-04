import gspread
from google.oauth2.service_account import Credentials
from dotenv import load_dotenv
import json
import os
import time
import redis
# Define the scope of the application
scope = ["https://www.googleapis.com/auth/spreadsheets"]

load_dotenv()
credentials_json = os.getenv("SECRET")
# Parse the credentials from JSON string to a dictionary
credentials_dict = json.loads(credentials_json)
# Use the credentials dictionary to authorize
credentials = Credentials.from_service_account_info(credentials_dict)
client = gspread.authorize(credentials)

# Open the spreadsheet by name or by sheet's URL
sheet = client.open("Copy of Copy of Grades and Student Dashboard").get_worksheet(4)

# Redis setup
redis_client = redis.Redis(host='redis', port=6379, db=0)

# Function to update Redis database
def update_redis():
    records = sheet.get_all_records()
    for record in records:
        redis_client.set(record['id'], json.dumps(record))

if __name__ == "__main__":
    update_redis()
