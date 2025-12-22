from datetime import datetime
from typing import Any, Dict, List, Optional

from bson import ObjectId
from app.core.database import get_database


async def save_job_match(match_data: Dict[str, Any]) -> str:
    """
    Save a job match result into the 'job_matches' collection.
    Returns the inserted document ID as a string.
    """
    db = get_database()

    doc = {
        **match_data,
        "created_at": datetime.utcnow(),
    }

    result = await db["job_matches"].insert_one(doc)
    return str(result.inserted_id)


async def get_matches_by_cv_id(cv_id: str) -> List[Dict[str, Any]]:
    """
    Fetch all job matches for a given cv_id from the 'job_matches' collection,
    sorted by newest first.
    """
    db = get_database()

    cursor = db["job_matches"].find({"cv_id": cv_id}).sort("created_at", -1)

    results: List[Dict[str, Any]] = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        results.append(doc)

    return results


async def create_tracked_job(job_data: Dict[str, Any]) -> str:
    """
    Insert a tracked job into the 'tracked_jobs' collection.
    Returns the inserted document ID as a string.
    """
    db = get_database()

    doc = {
        **job_data,
        "created_at": datetime.utcnow(),
    }

    result = await db["tracked_jobs"].insert_one(doc)
    return str(result.inserted_id)


async def get_tracked_jobs(cv_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Fetch tracked jobs from the 'tracked_jobs' collection.
    If cv_id is provided, filter by cv_id. Otherwise, return all.
    Sorted by newest first.
    """
    db = get_database()

    query: Dict[str, Any] = {}
    if cv_id:
        query["cv_id"] = cv_id

    cursor = db["tracked_jobs"].find(query).sort("created_at", -1)

    results: List[Dict[str, Any]] = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        results.append(doc)

    return results


async def delete_tracked_job(job_id: str) -> bool:
    """
    Delete a tracked job by its ID.
    Returns True if a document was deleted, False otherwise.
    """
    db = get_database()

    try:
        oid = ObjectId(job_id)
    except Exception:
        # Not a valid ObjectId string
        return False

    result = await db["tracked_jobs"].delete_one({"_id": oid})
    return result.deleted_count == 1


async def save_cover_letter(doc: Dict[str, Any]) -> str:
    db = get_database()
    doc["created_at"] = datetime.utcnow()
    res = await db["cover_letters"].insert_one(doc)
    return str(res.inserted_id)

async def get_latest_cover_letter_by_job_id(job_id: str) -> Optional[Dict[str, Any]]:
    db = get_database()
    cursor = db["cover_letters"].find({"job_id": job_id}).sort("created_at", -1).limit(1)
    results = await cursor.to_list(length=1)
    if not results:
        return None
    doc = results[0]
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

# app/services/job_repository.py
async def update_tracked_job(job_id: str, update: Dict[str, Any]) -> bool:
    db = get_database()
    try:
        oid = ObjectId(job_id)
    except Exception:
        return False

    # remove None fields
    update = {k: v for k, v in update.items() if v is not None}
    if not update:
        return False

    res = await db["tracked_jobs"].update_one({"_id": oid}, {"$set": update})
    return res.matched_count == 1

async def upsert_tracked_job_from_match(match_data: Dict[str, Any]) -> str:
    db = get_database()

    key = {
        "cv_id": match_data["cv_id"],
        "job_title": match_data.get("job_title"),
        "company": match_data.get("company"),
        "job_url": match_data.get("job_url"),
        "source": match_data.get("source"),

    }

    update_doc = {
        "$set": {
            "cv_id": match_data["cv_id"],
            "job_title": match_data.get("job_title"),
            "company": match_data.get("company"),
            "job_description": match_data.get("job_description"),
            "match_score": match_data.get("match_score"),
            "semantic_score": match_data.get("semantic_score"),
            "skill_score": match_data.get("skill_score"),
            "job_skills": match_data.get("job_skills", []),
            "overlapping_skills": match_data.get("overlapping_skills", []),
            "missing_skills": match_data.get("missing_skills", []),
        },
        "$setOnInsert": {
            "created_at": datetime.utcnow(),
            "status": "saved",
            "notes": "",
        },
    }

    res = await db["tracked_jobs"].update_one(key, update_doc, upsert=True)

    # return the doc id as string
    if res.upserted_id:
        return str(res.upserted_id)

    # if it was an update, fetch the existing doc id
    doc = await db["tracked_jobs"].find_one(key, {"_id": 1})
    return str(doc["_id"])
