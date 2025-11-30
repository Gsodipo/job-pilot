from fastapi import APIRouter, HTTPException, status

from app.schemas.job_match_schema import JobMatchRequest, JobMatchResponse
from app.services.cv_repository import get_cv_by_id
from app.services.job_matcher import JobMatcherService
from app.services.cv_parser import extract_skills_from_text

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

    return result_dict
