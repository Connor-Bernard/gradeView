import redis
import json
import os
from dotenv import load_dotenv



load_dotenv()
PORT = int(os.getenv("SERVER_PORT"))
HOST = os.getenv("SERVER_HOST")
DB = int(os.getenv("SERVER_DBINDEX"))
REDIS_PW = os.getenv("REDIS_DB_SECRET")
redis_client = redis.Redis(host=HOST, port=PORT, db=DB, password=REDIS_PW) 
def flush_redis_db():
    redis_client.flushdb()

if __name__ == "__main__":
    flush_redis_db()
