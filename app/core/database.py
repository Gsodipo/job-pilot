import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

# Load variables from .env
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "jobpilot")

client: AsyncIOMotorClient | None = None


def get_client() -> AsyncIOMotorClient:
    global client
    if client is None:
        client = AsyncIOMotorClient(MONGO_URI)
    return client


def get_database():
    mongo_client = get_client()
    return mongo_client[MONGO_DB_NAME]


# ✅ ADD THESE LINES
db = get_database()
cvs_collection = db["cvs"]
jobs_collection = db["jobs"]
