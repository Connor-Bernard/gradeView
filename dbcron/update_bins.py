import gspread
from google.oauth2.service_account import Credentials
from dotenv import load_dotenv
import json
import os
import redis

load_dotenv()

PORT = int(os.getenv("SERVER_PORT"))
SCOPES = json.loads(os.getenv("SPREADSHEET_SCOPES"))
HOST = os.getenv("SERVER_HOST")
DB = int(os.getenv("BINS_DBINDEX"))
SHEETNAME = os.getenv("SPREADSHEET_SHEETNAME")
WORKSHEET = int(os.getenv("BINS_WORKSHEET"))

REDIS_PW = os.getenv("REDIS_DB_SECRET")

#needs both spreadsheet and drive access or else there is a permissions error, added as a viewer on the spreadsheet
credentials_json = os.getenv("GRADE_DB_SECRET")
credentials_dict = json.loads(credentials_json)
credentials = Credentials.from_service_account_info(credentials_dict, scopes=SCOPES)
client = gspread.authorize(credentials)

#redis setup
redis_client = redis.Redis(host=HOST, port=PORT, db=DB, password=REDIS_PW) 

def update_bins():
    print("Updating Bins HERE 99999999999999")
    sheet = client.open(SHEETNAME).get_worksheet(WORKSHEET)
    # Assuming your grades start at row 51 and end at row 61, and columns are 0-indexed
    start_row = int(os.getenv("BINS_START_ROW"))
    end_row = int(os.getenv("BINS_END_ROW"))
    points_col = int(os.getenv("BINS_POINTS_COL"))
    grades_col = int(os.getenv("BINS_GRADES_COL"))

    # Initialize a dictionary to store grade bins
    grade_bins = []

    # Loop over the rows and read the grades and points
    for i in range(start_row, end_row + 1):
        # Read the values from the spreadsheet
        row_values = sheet.row_values(i)
        # Create a dict for the letter and points
        grade_bin = {
            "letter": row_values[grades_col], # Adjust for zero-indexed list
            "points": int(row_values[points_col]) # Adjust for zero-indexed list and convert to int
        }
        # Append to the list
        grade_bins.append(grade_bin)

    # Serialize the list of grade bins to JSON
    bins_json = json.dumps({"bins": grade_bins})

    # Store the JSON string in Redis under the key 'bins'
    redis_client.set("bins", bins_json)

if __name__ == "__main__":
    update_bins()