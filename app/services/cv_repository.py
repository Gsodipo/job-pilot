from datetime import datetime
from typing import Any, Dict, Optional

from bson import ObjectId

from app.core.database import get_database


async def insert_cv(cv_data: Dict[str, Any]) -> str:
    """
    Insert a CV document into the 'cvs' collection and return the inserted id as string.
    """
    db = get_database()
    doc = {
        **cv_data,
        "created_at": datetime.utcnow(),
    }

    result = await db["cvs"].insert_one(doc)
    return str(result.inserted_id)

async def get_cv_by_id(cv_id: str) -> Optional[Dict[str, Any]]:
    db = get_database()
    try:
        oid = ObjectId(cv_id)
    except Exception:
        return None

    doc = await db["cvs"].find_one({"_id": oid})
    if not doc:
        return None

    # convert _id to string for convenience
    doc["id"] = str(doc["_id"])
    return doc
