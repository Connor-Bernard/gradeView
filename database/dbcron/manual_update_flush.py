import update_db
import flush_db
import redis
import os
from dotenv import load_dotenv
load_dotenv()
if __name__ == "__main__":
    flush_db()
    update_db()
