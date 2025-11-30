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
    cv_id: str
    job_title: Optional[str]
    company: Optional[str]

    match_score: float  # 0–100
    semantic_score: float  # 0–1
    skill_score: float  # 0–1

    job_skills: List[str]
    overlapping_skills: List[str]
    missing_skills: List[str]
