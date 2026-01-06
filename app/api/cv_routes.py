from fastapi import APIRouter, UploadFile, File, HTTPException, status
import traceback

from app.services.cv_parser import parse_pdf, extract_skills, extract_experience
from app.services.cv_repository import insert_cv

router = APIRouter()

@router.post("/upload_cv")
async def upload_cv(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported.",
        )

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty.",
        )

    # 1) Parse PDF
    try:
        parsed_text = parse_pdf(file_bytes)
        if not parsed_text or not parsed_text.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not extract text from this PDF (it may be scanned or protected).",
            )
    except HTTPException:
        raise
    except Exception as e:
        print("❌ Error parsing PDF")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error parsing PDF: {type(e).__name__}: {e}",
        )

    # 2) Extract structured data
    try:
        skills = extract_skills(parsed_text)
        experience = extract_experience(parsed_text)
    except Exception as e:
        print("❌ Error extracting skills/experience")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error extracting CV data: {type(e).__name__}: {e}",
        )

    cv_doc = {
        "file_name": file.filename,
        "parsed_text": parsed_text,
        "skills": skills,
        "experience": experience,
    }

    # 3) Save to MongoDB
    try:
        cv_id = await insert_cv(cv_doc)
    except Exception as e:
        print("❌ Error saving CV to MongoDB")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving CV to database: {type(e).__name__}: {e}",
        )

    return {
        "cv_id": cv_id,
        "file_name": file.filename,
        "skills": skills,
        "experience": experience,
    }
