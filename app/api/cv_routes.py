from fastapi import APIRouter, UploadFile, File, HTTPException, status

from app.services.cv_parser import parse_pdf, extract_skills, extract_experience
from app.services.cv_repository import insert_cv

router = APIRouter()


@router.post("/upload_cv")
async def upload_cv(file: UploadFile = File(...)):
    # basic validation
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported.",
        )

    # read file bytes
    file_bytes = await file.read()

    try:
        parsed_text = parse_pdf(file_bytes)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error parsing PDF: {e}",
        )

    # Extract structured data
    skills = extract_skills(parsed_text)
    experience = extract_experience(parsed_text)

    # Prepare data for DB
    cv_doc = {
        "file_name": file.filename,
        "parsed_text": parsed_text,
        "skills": skills,
        "experience": experience,
    }

    # Save to MongoDB
    try:
        cv_id = await insert_cv(cv_doc)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving CV to database: {e}",
        )

    return {
        "cv_id": cv_id,
        "file_name": file.filename,
        "skills": skills,
        "experience": experience,
    }

