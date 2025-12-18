# app/schemas/cover_letter_schema.py
from pydantic import BaseModel, Field
from typing import Optional


class CoverLetterRequest(BaseModel):
    cv_id: str = Field(..., description="ID of the stored CV document")
    job_id: str = Field(..., description="Tracked job ID (Mongo _id as string)")
    job_title: str = Field(..., description="Target job title")
    company: str = Field(..., description="Target company")
    job_description: str = Field(..., description="Full job description text")
    tone: Optional[str] = Field(
        default="professional",
        description="Tone of the cover letter (e.g. professional, enthusiastic)",
    )
