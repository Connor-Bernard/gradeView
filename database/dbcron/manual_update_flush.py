import update_db
import flush_db
import update_bins
import redis
import os
from dotenv import load_dotenv
load_dotenv()
if __name__ == "__main__":
    flush_db()
    update_db()
    update_bins()
