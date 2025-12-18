from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class JobCreate(BaseModel):
    cv_id: str
    job_title: str
    company: str
    status: Optional[str] = "saved"
    notes: Optional[str] = None
    job_description: Optional[str] = None
    job_match_id: Optional[str] = None

class JobUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class JobResponse(BaseModel):
    id: str
    created_at: datetime
    cv_id: str
    job_title: str
    company: str
    status: Optional[str] = "saved"
    notes: Optional[str] = None
    job_description: Optional[str] = None
    job_match_id: Optional[str] = None
