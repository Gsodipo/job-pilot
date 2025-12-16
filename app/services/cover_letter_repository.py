# app/services/cover_letter_repository.py

from typing import Optional, Dict, Any
from datetime import datetime
from bson import ObjectId

from app.core.database import get_database


async def save_cover_letter(data: Dict[str, Any]) -> str:
    """
    Save a cover letter linked to a job_id.
    """
    db = get_database()
    data["created_at"] = datetime.utcnow()

    result = await db["cover_letters"].insert_one(data)
    return str(result.inserted_id)


async def get_latest_cover_letter_by_job_id(job_id: str) -> Optional[Dict[str, Any]]:
    """
    Fetch the most recent cover letter for a given job_id.
    """
    db = get_database()

    doc = await db["cover_letters"].find_one(
        {"job_id": job_id},
        sort=[("created_at", -1)],
    )

    if not doc:
        return None

    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc
