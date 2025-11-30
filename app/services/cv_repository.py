from datetime import datetime
from typing import Any, Dict

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

async def get_cv_by_id(cv_id: str) -> Dict[str, Any] | None:
    """
    Fetch a CV document from the 'cvs' collection by its MongoDB ObjectId.
    Returns the document as a dict or None if not found.
    """
    try:
        obj_id = ObjectId(cv_id)
    except Exception:
        return None

    db = get_database()
    doc = await db["cvs"].find_one({"_id": obj_id})
    return doc
