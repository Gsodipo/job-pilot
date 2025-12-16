from pydantic import BaseModel, Field
from typing import Optional


class CoverLetterRequest(BaseModel):
    cv_id: str = Field(..., description="ID of the stored CV document")
    job_title: str = Field(..., description="Target job title")
    company: str = Field(..., description="Target company")
    job_description: str = Field(..., description="Full job description text")
    tone: Optional[str] = Field(
        default="professional",
        description="Tone of the cover letter (e.g. professional, enthusiastic)",
    )


class CoverLetterRequest(BaseModel):
    cv_id: str
    job_id: Optional[str] = None  # ✅ ADD THIS
    job_title: str
    company: str
    job_description: str
    tone: Optional[str] = "professional"