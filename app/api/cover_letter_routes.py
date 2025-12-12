import os
from bson import ObjectId
from fastapi import APIRouter, HTTPException
from app.schemas.cover_letter_schema import CoverLetterRequest
from app.services.cover_letter_service import generate_cover_letter_text
from app.services.openai_cover_letter import generate_cover_letter_llm
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

    # Debug
    print("OPENAI_API_KEY set:", bool(os.getenv("OPENAI_API_KEY")))
    print("OPENAI_MODEL:", os.getenv("OPENAI_MODEL"))

    # 3) If no key, fallback template
    if not os.getenv("OPENAI_API_KEY"):
        return {"cover_letter": generate_cover_letter_text(cv_doc, req), "mode": "template"}

    # 4) Try OpenAI; fallback if it fails
    try:
        letter = generate_cover_letter_llm(
            cv_doc=cv_doc,
            job_title=req.job_title,
            company=req.company,
            job_description=req.job_description,
            tone=req.tone or "professional",
        )
        return {"cover_letter": letter, "mode": "openai"}
    except Exception as e:
        return {
            "cover_letter": generate_cover_letter_text(cv_doc, req),
            "mode": "template",
            "note": f"OpenAI failed: {type(e).__name__}",
        }
