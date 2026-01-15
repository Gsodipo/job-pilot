# app/services/cover_letter_repository.py
from datetime import datetime
from typing import Any, Dict, List, Optional

from bson import ObjectId
from app.core.database import get_database


async def save_cover_letter(doc: Dict[str, Any]) -> str:
    """
    Saves a cover letter record.
    """
    db = get_database()
    payload = {
        **doc,
        "created_at": datetime.utcnow(),
    }
    res = await db["cover_letters"].insert_one(payload)
    return str(res.inserted_id)


async def get_latest_cover_letter_by_job_id(job_id: str) -> Optional[Dict[str, Any]]:
    """
    Returns the most recent cover letter for a given tracked job_id.
    """
    db = get_database()
    doc = await (
        db["cover_letters"]
        .find({"job_id": job_id})
        .sort("created_at", -1)
        .limit(1)
        .to_list(length=1)
    )

    if not doc:
        return None

    item = doc[0]
    item["_id"] = str(item["_id"])
    return item


async def get_cover_letter_history_by_job_id(job_id: str, limit: int = 25) -> List[Dict[str, Any]]:
    """
    Returns cover letter history for a tracked job_id (newest first).
    """
    db = get_database()

    cursor = (
        db["cover_letters"]
        .find({"job_id": job_id})
        .sort("created_at", -1)
        .limit(limit)
    )

    results: List[Dict[str, Any]] = []
    async for item in cursor:
        item["_id"] = str(item["_id"])
        results.append(item)

    return results
