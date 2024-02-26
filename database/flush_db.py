import redis
import json
import os

config_path = 'config/default.json'

with open(config_path, 'r') as config_file:
    config = json.load(config_file)

HOST = config['server']['host']
PORT = config['server']['port']
DB = config['server']['db']

redis_client = redis.Redis(host=HOST, port=PORT, db=DB) 
def flush_redis_db():
    redis_client.flushdb()

if __name__ == "__main__":
    flush_redis_db()
