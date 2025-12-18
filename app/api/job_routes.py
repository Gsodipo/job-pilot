from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, HTTPException, status, Query, Response

from app.schemas.job_match_schema import JobMatchRequest, JobMatchResponse
from app.schemas.job_tracker_schema import JobCreate, JobResponse, JobUpdate
from app.services.cv_repository import get_cv_by_id
from app.services.job_matcher import JobMatcherService
from app.services.cv_parser import extract_skills_from_text
from app.services.job_repository import (
    save_job_match,
    get_matches_by_cv_id,
    get_tracked_jobs,
    create_tracked_job,
    delete_tracked_job,
    update_tracked_job,
)

router = APIRouter(prefix="/jobs", tags=["Job Matching"])
job_matcher = JobMatcherService()


@router.post("/match", response_model=JobMatchResponse)
async def match_job(payload: JobMatchRequest):
    cv_doc = await get_cv_by_id(payload.cv_id)
    if cv_doc is None:
        raise HTTPException(status_code=404, detail="CV not found for the given cv_id")

    cv_text = cv_doc.get("parsed_text") or cv_doc.get("text") or ""
    cv_skills = cv_doc.get("skills", [])

    if not cv_text:
        raise HTTPException(status_code=400, detail="Stored CV does not contain parsed text.")

    job_description = payload.job_description
    job_skills = extract_skills_from_text(job_description)

    result_dict = job_matcher.compute_match_result(
        cv_id=payload.cv_id,
        cv_text=cv_text,
        cv_skills=cv_skills,
        job_title=payload.job_title,
        company=payload.company,
        job_description=job_description,
        job_skills=job_skills,
    )

    # Save match history
    result_dict["job_description"] = job_description
    match_id = await save_job_match(result_dict)
    result_dict["id"] = match_id  # for response_model

    # ✅ ALSO create a tracked job (so status/delete works)
    await create_tracked_job({
        "cv_id": payload.cv_id,
        "job_title": payload.job_title,
        "company": payload.company,
        "status": "saved",
        "job_description": job_description,
        "job_match_id": match_id,
    })

    return result_dict


@router.get("/history/{cv_id}", response_model=List[JobMatchResponse])
async def get_job_history(cv_id: str):
    matches = await get_matches_by_cv_id(cv_id)
    return matches or []


@router.get("", response_model=List[JobResponse], summary="List tracked jobs")
async def list_tracked_jobs(cv_id: Optional[str] = Query(default=None)):
    return await get_tracked_jobs(cv_id=cv_id)


@router.post("", response_model=JobResponse, summary="Create tracked job")
async def create_tracked_job_endpoint(payload: JobCreate) -> JobResponse:
    job_dict = payload.dict()
    inserted_id = await create_tracked_job(job_dict)
    return JobResponse(id=inserted_id, created_at=datetime.utcnow(), **job_dict)


@router.patch("/{job_id}", status_code=204)
async def update_tracked_job_endpoint(job_id: str, payload: JobUpdate):
    updated = await update_tracked_job(job_id, payload.dict())
    if not updated:
        raise HTTPException(status_code=404, detail="Tracked job not found")
    return Response(status_code=204)  # ✅ FIXED (no comma)


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete tracked job")
async def delete_tracked_job_endpoint(job_id: str):
    deleted = await delete_tracked_job(job_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Tracked job not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
