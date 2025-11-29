from typing import List, Optional
from pydantic import BaseModel


class CVCreate(BaseModel):
    file_name: str
    parsed_text: str
    skills: List[str]
    experience: List[str]


class CVInDB(CVCreate):
    id: str
