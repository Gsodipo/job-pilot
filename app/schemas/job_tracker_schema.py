from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class JobCreate(BaseModel):
    cv_id: str = Field(..., description="ID of the CV this job is associated with")
    job_title: str
    company: str
    match_score: Optional[float] = Field(
        default=None, description="Optional match score from the matcher"
    )
    status: str = Field(
        default="Saved",
        description="Job status: Saved, Applied, Interview, Offer, Rejected",
    )
    notes: Optional[str] = Field(
        default=None,
        description="Optional notes about this job application",
    )


class JobResponse(JobCreate):
    id: str
    created_at: datetime
