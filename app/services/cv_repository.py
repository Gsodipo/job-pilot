from datetime import datetime
from typing import Any, Dict, Optional

from bson import ObjectId
from app.core.database import get_database


async def insert_cv(cv_data: Dict[str, Any], user_id: str) -> str:
    """
    Insert a CV document into the 'cvs' collection, owned by user_id.
    """
    db = get_database()
    doc = {
        **cv_data,
        "user_id": user_id,          # ✅ IMPORTANT
        "created_at": datetime.utcnow(),
    }

    result = await db["cvs"].insert_one(doc)
    return str(result.inserted_id)


async def get_cv_by_id_for_user(cv_id: str, user_id: str) -> Optional[Dict[str, Any]]:
    """
    Fetch CV by id ONLY if it belongs to user_id.
    """
    db = get_database()
    try:
        oid = ObjectId(cv_id)
    except Exception:
        return None

    doc = await db["cvs"].find_one({"_id": oid, "user_id": user_id})
    if not doc:
        return None

    doc["id"] = str(doc["_id"])
    doc["_id"] = str(doc["_id"])  # optional convenience
    return doc


# (Optional) keep your old function if other routes still use it
async def get_cv_by_id(cv_id: str) -> Optional[Dict[str, Any]]:
    db = get_database()
    try:
        oid = ObjectId(cv_id)
    except Exception:
        return None

    doc = await db["cvs"].find_one({"_id": oid})
    if not doc:
        return None

    doc["id"] = str(doc["_id"])
    return doc
