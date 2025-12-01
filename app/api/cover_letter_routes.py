from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.cover_letter_schema import CoverLetterRequest, CoverLetterResponse
from app.services.cv_repository import get_cv_by_id
from app.services.cover_letter_service import generate_cover_letter_text

router = APIRouter(prefix="/cover-letter", tags=["Cover Letters"])


@router.post("/generate", response_model=CoverLetterResponse)
async def generate_cover_letter(payload: CoverLetterRequest) -> CoverLetterResponse:
    # 1. Fetch CV from DB
    cv_doc = await get_cv_by_id(payload.cv_id)
    if not cv_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CV not found for the given cv_id.",
        )

    # 2. Generate letter text (template-based for now)
    letter_text = generate_cover_letter_text(cv_doc, payload)

    # 3. Return structured response
    return CoverLetterResponse(
        cv_id=payload.cv_id,
        job_title=payload.job_title,
        company=payload.company,
        tone=payload.tone or "professional",
        cover_letter=letter_text,
    )
