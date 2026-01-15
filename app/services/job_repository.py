# app/services/job_repository.py
from datetime import datetime
from typing import Any, Dict, List, Optional
from bson import ObjectId

from app.core.database import get_database

db = get_database()

def _oid(x: str):
    try:
        return ObjectId(x)
    except Exception:
        return None

# --------------------------
# MATCH HISTORY (per user)
# --------------------------
async def save_job_match_for_user(user_id: str, match: Dict[str, Any]) -> str:
    doc = {**match, "user_id": user_id, "created_at": datetime.utcnow()}
    res = await db.job_matches.insert_one(doc)
    return str(res.inserted_id)

async def get_matches_by_cv_id_for_user(user_id: str, cv_id: str, limit: int = 50) -> List[Dict[str, Any]]:
    cursor = (
        db.job_matches
        .find({"user_id": user_id, "cv_id": cv_id})
        .sort("created_at", -1)
        .limit(limit)
    )
    items = await cursor.to_list(length=limit)
    # normalize _id -> id
    for it in items:
        it["id"] = str(it["_id"])
    return items

# --------------------------
# TRACKED JOBS (per user)
# --------------------------
async def get_tracked_jobs_for_user(user_id: str, cv_id: Optional[str] = None) -> List[Dict[str, Any]]:
    q = {"user_id": user_id}
    if cv_id:
        q["cv_id"] = cv_id
    cursor = db.tracked_jobs.find(q).sort("created_at", -1)
    items = await cursor.to_list(length=200)
    for it in items:
        it["id"] = str(it["_id"])
    return items

async def create_tracked_job_for_user(user_id: str, job: Dict[str, Any]) -> str:
    doc = {**job, "user_id": user_id, "created_at": datetime.utcnow()}
    res = await db.tracked_jobs.insert_one(doc)
    return str(res.inserted_id)

async def update_tracked_job_for_user(user_id: str, job_id: str, updates: Dict[str, Any]) -> bool:
    oid = _oid(job_id)
    if not oid:
        return False
    res = await db.tracked_jobs.update_one(
        {"_id": oid, "user_id": user_id},
        {"$set": {**updates, "updated_at": datetime.utcnow()}}
    )
    return res.modified_count > 0

async def delete_tracked_job_for_user(user_id: str, job_id: str) -> bool:
    oid = _oid(job_id)
    if not oid:
        return False
    res = await db.tracked_jobs.delete_one({"_id": oid, "user_id": user_id})
    return res.deleted_count > 0

async def upsert_tracked_job_from_match_for_user(user_id: str, payload: Dict[str, Any]) -> str:
    # If you have your own rules, keep them. This is a safe default:
    q = {"user_id": user_id, "cv_id": payload.get("cv_id"), "job_title": payload.get("job_title"), "company": payload.get("company")}
    update = {"$set": {**payload, "user_id": user_id, "updated_at": datetime.utcnow()}, "$setOnInsert": {"created_at": datetime.utcnow()}}
    res = await db.tracked_jobs.update_one(q, update, upsert=True)
    # If inserted, upserted_id exists; otherwise fetch the matched doc
    if res.upserted_id:
        return str(res.upserted_id)
    doc = await db.tracked_jobs.find_one(q)
    return str(doc["_id"])
