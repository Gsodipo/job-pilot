import io
import fitz  # PyMuPDF
import re

def parse_pdf(file_bytes: bytes) -> str:
    """
    Take raw PDF bytes and return the combined text from all pages.
    """
    # create an in-memory stream
    pdf_stream = io.BytesIO(file_bytes)

    # open with fitz
    doc = fitz.open(stream=pdf_stream, filetype="pdf")

    all_text = []
    for page in doc:
        text = page.get_text("text")
        if text:
            all_text.append(text)

    doc.close()

    # join pages and clean up whitespace a bit
    return "\n".join(all_text).strip()

# Simple skill vocabulary for now (you can expand this)
SKILL_KEYWORDS = [
    "python", "fastapi", "react", "javascript", "typescript",
    "html", "css", "linux", "sql", "mongodb", "docker",
    "git", "jira", "power bi", "excel", "data analysis",
    "networking", "troubleshooting", "azure", "aws"
]

def extract_skills(text: str):
    text_lower = text.lower()
    found_skills = []

    for skill in SKILL_KEYWORDS:
        if skill in text_lower:
            found_skills.append(skill.capitalize())

    return found_skills

def extract_experience(text: str):
    # Very simple starter pattern: lines that look like job titles
    experience = []

    lines = text.split("\n")
    for line in lines:
        if any(keyword in line.lower() for keyword in ["assistant", "engineer", "developer", "intern", "manager"]):
            experience.append(line.strip())

    return experience


