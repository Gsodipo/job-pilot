# app/api/cover_letter_routes.py
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


@router.get("/cover-letter/latest/{job_id}")
async def get_latest_cover_letter(job_id: str):
    doc = await get_latest_cover_letter_by_job_id(job_id)
    if not doc:
        return {"cover_letter": "", "mode": "none", "note": "No cover letter saved for this job yet."}

    return {
        "cover_letter": doc.get("text", ""),
        "mode": doc.get("mode", "template"),
        "note": doc.get("note"),
    }


@router.post("/cover-letter/generate")
async def generate_cover_letter(req: CoverLetterRequest):
    # 1) CV lookup
    cv_doc = await cvs_collection.find_one({"cv_id": req.cv_id})
    if not cv_doc:
        oid = _to_object_id(req.cv_id)
        if oid:
            cv_doc = await cvs_collection.find_one({"_id": oid})
    if not cv_doc:
        raise HTTPException(status_code=404, detail="CV not found")

    # 2) Generate letter (OpenAI if key exists, else template)
    mode = "template"
    note = None

    if os.getenv("OPENAI_API_KEY"):
        try:
            letter = generate_cover_letter_llm(
                cv_doc=cv_doc,
                job_title=req.job_title,
                company=req.company,
                job_description=req.job_description,
                tone=req.tone or "professional",
            )
            mode = "openai"
        except Exception as e:
            letter = generate_cover_letter_text(cv_doc, req)
            mode = "template"
            note = f"OpenAI failed: {type(e).__name__}"
    else:
        letter = generate_cover_letter_text(cv_doc, req)

    # ✅ 3) Persist per job_id
    await save_cover_letter(
        {
            "cv_id": req.cv_id,
            "job_id": req.job_id,
            "job_title": req.job_title,
            "company": req.company,
            "tone": req.tone or "professional",
            "text": letter,
            "mode": mode,
            "note": note,
        }
    )

    return {"cover_letter": letter, "mode": mode, "note": note}
