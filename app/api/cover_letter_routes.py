import os
from bson import ObjectId
from fastapi import APIRouter, HTTPException

from app.schemas.cover_letter_schema import CoverLetterRequest
from app.services.cover_letter_service import generate_cover_letter_text
from app.services.openai_cover_letter import generate_cover_letter_llm
from app.services.cover_letter_repository import (
    save_cover_letter,
    get_latest_cover_letter_by_job_id,
)
from app.core.database import cvs_collection

router = APIRouter()

def _to_object_id(value: str):
    try:
        return ObjectId(value)
    except Exception:
        return None

@router.post("/cover-letter/generate")
async def generate_cover_letter(req: CoverLetterRequest):
    # 1) Try lookup by cv_id field
    cv_doc = await cvs_collection.find_one({"cv_id": req.cv_id})

    # 2) If not found, try lookup by Mongo _id
    if not cv_doc:
        oid = _to_object_id(req.cv_id)
        if oid:
            cv_doc = await cvs_collection.find_one({"_id": oid})

    if not cv_doc:
        raise HTTPException(status_code=404, detail="CV not found")

    tone = req.tone or "professional"

    # 3) If no key, fallback template
    if not os.getenv("OPENAI_API_KEY"):
        letter = generate_cover_letter_text(cv_doc, req)
        mode = "template"
        note = "OPENAI_API_KEY not set (template mode)."
    else:
        # 4) Try OpenAI; fallback if it fails
        try:
            letter = generate_cover_letter_llm(
                cv_doc=cv_doc,
                job_title=req.job_title,
                company=req.company,
                job_description=req.job_description,
                tone=tone,
            )
            mode = "openai"
            note = None
        except Exception as e:
            letter = generate_cover_letter_text(cv_doc, req)
            mode = "template"
            note = f"OpenAI failed: {type(e).__name__}"

    # ✅ 5) Save to Mongo if job_id is provided
    if req.job_id:
        await save_cover_letter({
            "cv_id": req.cv_id,
            "job_id": req.job_id,
            "job_title": req.job_title,
            "company": req.company,
            "tone": tone,
            "mode": mode,
            "cover_letter": letter,
        })

    return {"cover_letter": letter, "mode": mode, "note": note}


@router.get("/cover-letter/by-job/{job_id}")
async def get_cover_letter_by_job(job_id: str):
    doc = await get_latest_cover_letter_by_job_id(job_id)
    if not doc:
        return {
            "cover_letter": "",
            "mode": "template",
            "note": "No saved cover letter for this job yet. Generate one first.",
        }

    return {
        "cover_letter": doc.get("cover_letter", ""),
        "mode": doc.get("mode", "template"),
        "note": None,
    }
