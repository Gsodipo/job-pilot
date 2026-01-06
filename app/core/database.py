import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

# Load variables from .env (local only)
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "jobpilot")

if not MONGO_URI:
    raise RuntimeError("MONGO_URI environment variable is not set")

client: AsyncIOMotorClient | None = None


def get_client() -> AsyncIOMotorClient:
    global client
    if client is None:
        client = AsyncIOMotorClient(MONGO_URI)
    return client


def get_database():
    mongo_client = get_client()
    return mongo_client[MONGO_DB_NAME]


# collections
db = get_database()
cvs_collection = db["cvs"]
jobs_collection = db["jobs"]
