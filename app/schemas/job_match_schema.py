from typing import List, Optional
from pydantic import BaseModel, Field


class JobMatchRequest(BaseModel):
    cv_id: str = Field(..., description="ID of the stored CV document")
    job_title: Optional[str] = Field(
        None, description="Job title for this application (optional)"
    )
    company: Optional[str] = Field(
        None, description="Company name for this application (optional)"
    )
    job_description: str = Field(
        ..., description="Full job description text to match the CV against"
    )


class JobMatchResponse(BaseModel):
    id: str
    cv_id: str
    job_title: Optional[str]
    company: Optional[str]
    job_description: str  # ✅ ADD THIS

    match_score: float
    semantic_score: float
    skill_score: float

    job_skills: List[str]
    overlapping_skills: List[str]
    missing_skills: List[str]


class JobUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
   

