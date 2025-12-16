from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, HTTPException, status, Query, Response

from app.schemas.job_match_schema import JobMatchRequest, JobMatchResponse
from app.schemas.job_tracker_schema import JobCreate, JobResponse
from app.services.cv_repository import get_cv_by_id
from app.services.job_matcher import JobMatcherService
from app.services.cv_parser import extract_skills_from_text
from app.services.job_repository import (
    save_job_match,
    get_matches_by_cv_id,
    get_tracked_jobs,
    create_tracked_job,
    delete_tracked_job,
)


router = APIRouter(
    prefix="/jobs",
    tags=["Job Matching"],
)

job_matcher = JobMatcherService()


@router.post("/match", response_model=JobMatchResponse)
async def match_job(payload: JobMatchRequest):
    # 1. Fetch CV document by cv_id using your helper
    cv_doc = await get_cv_by_id(payload.cv_id)

    if cv_doc is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CV not found for the given cv_id",
        )

    # 2. Get CV text + skills from stored document
    cv_text = cv_doc.get("parsed_text") or cv_doc.get("text") or ""
    cv_skills = cv_doc.get("skills", [])

    if not cv_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Stored CV does not contain parsed text.",
        )

    # 3. Extract job skills from the job description
    job_description = payload.job_description
    job_skills = extract_skills_from_text(job_description)

    # 4. Use the JobMatcherService to compute scores
    result_dict = job_matcher.compute_match_result(
        cv_id=payload.cv_id,
        cv_text=cv_text,
        cv_skills=cv_skills,
        job_title=payload.job_title,
        company=payload.company,
        job_description=job_description,
        job_skills=job_skills,
    )

    result_dict["job_description"] = job_description
    inserted_id = await save_job_match(result_dict)

    # ✅ add id so response_model validation passes
    result_dict["id"] = inserted_id

    return result_dict

@router.get("/history/{cv_id}", response_model=List[JobMatchResponse])
async def get_job_history(cv_id: str):
    """
    Return all job matches that were previously run for a given CV,
    sorted by newest first.
    """
    matches = await get_matches_by_cv_id(cv_id)

    if not matches:
        # You can either return [] or 404; I prefer empty list with 200.
        return []

    return matches

@router.get(
    "",
    response_model=List[JobResponse],
    summary="List tracked jobs",
)
async def list_tracked_jobs(
    cv_id: Optional[str] = Query(default=None, description="Filter by CV ID")
):
    """
    List tracked jobs.
    - If cv_id is provided, return jobs for that CV.
    - If not, return all tracked jobs.
    """
    jobs = await get_tracked_jobs(cv_id=cv_id)
    return jobs

@router.post(
    "",
    response_model=JobResponse,
    summary="Create tracked job",
)
async def create_tracked_job_endpoint(payload: JobCreate) -> JobResponse:
    """
    Create a tracked job entry (for the job application tracker).
    """
    job_dict = payload.dict()
    inserted_id = await create_tracked_job(job_dict)

    return JobResponse(
        id=inserted_id,
        created_at=datetime.utcnow(),
        **job_dict,
    )

@router.delete(
    "/{job_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete tracked job",
)
async def delete_tracked_job_endpoint(job_id: str):
    """
    Delete a tracked job by its ID.
    Returns 204 if deleted, 404 if not found/invalid.
    """
    deleted = await delete_tracked_job(job_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tracked job not found",
        )

    # 204 No Content – empty response
    return Response(status_code=status.HTTP_204_NO_CONTENT)




