# Author: Naveen Nathan
import time, requests, datetime

import os.path
import json
"""
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
"""

# CS10 Su24 course id
COURSE_INSTANCE_ID = 155812
SERVER = "https://us.prairielearn.com/pl/api/v1"

# This scope allows for write access.
SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
SPREADSHEET_ID = "16e6hWK4wWiqetuyJrDvBy4O9Wwp83NR1JptZU1dIIxI"
GRADEBOOK_SPREADSHEET_ID = ""

"""
Allows the user authenticate their google account, allowing the script to modify spreadsheets in their name.
Borrowed from here: https://developers.google.com/sheets/api/quickstart/python
"""


def allow_user_to_authenticate_google_account():
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                "credentials.json", SCOPES
            )
            creds = flow.run_local_server(port=0)
            print("Authentication succesful")
    # Save the credentials for the next run
    with open("token.json", "w") as token:
        token.write(creds.to_json())
    return creds


"""
This method is adapted from Prairielearn's public repository.
https://github.com/PrairieLearn/PrairieLearn/blob/63c90a6523a3061743b8653a4cfafc62e0e0dbff/tools/api_download.py#L68
"""


def get_json(endpoint, token):
    url = SERVER + endpoint
    headers = {'Private-Token': token}
    start_time = time.time()
    retry_502_max = 30
    retry_502_i = 0
    while True:
        r = requests.get(url, headers=headers)
        if r.status_code == 200:
            break
        elif r.status_code == 502:
            retry_502_i += 1
            if retry_502_i >= retry_502_max:
                raise Exception(f'Maximum number of retries reached on 502 Bad Gateway Error for {url}')
            else:
                print(f'Bad Gateway Error encountered for {url}, retrying in 10 seconds')
                time.sleep(10)
                continue
        else:
            raise Exception(f'Invalid status returned for {url}: {r.status_code}')

    end_time = time.time()

    data = r.json()

    return data
def initialize_sheet_api_instance(creds):
    service = build("sheets", "v4", credentials=creds)
    sheet = service.spreadsheets()
    return sheet

def retrieve_gradebook():
    token = input("Please enter your PrairieLearn api token: ")
    course_instance_path = f'/course_instances/{COURSE_INSTANCE_ID}'
    #creds = allow_user_to_authenticate_google_account()
    #sheet = initialize_sheet_api_instance(creds)
    print(get_json(f"/course_instances/{COURSE_INSTANCE_ID}/gradebook", token))


retrieve_gradebook()