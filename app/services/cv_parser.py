import io
import fitz  # PyMuPDF
import re
from typing import List

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

    # Core IT Support / Helpdesk
    "it support",
    "technical support",
    "helpdesk",
    "service desk",
    "troubleshooting",
    "ticketing",
    "incident management",
    "hardware support",
    "software support",
    "desktop support",
    "end-user support",

    # Device Management (Mac + Windows)
    "mac",
    "macos",
    "windows",
    "intune",
    "jamf",
    "mdm",
    "device management",
    "device provisioning",
    "asset management",
    "oomnitza",

    # Identity & Access Management
    "okta",
    "azure ad",
    "google workspace",
    "ldap",
    "sso",
    "iam",
    "user provisioning",
    "user deprovisioning",
    "user lifecycle",

    # SaaS Administration
    "saas",
    "saas administration",
    "google admin",
    "office 365",
    "gsuite",

    # Ticketing Tools
    "jira",
    "zendesk",
    "freshdesk",
    "servicenow",

    # Collaboration Tools
    "slack",
    "google chat",
    "webex",
    "zoom",
    "microsoft teams",

    # General Technical Skills
    "git",
    "github",
    "excel",
    "sql",
    "python",
    "bash",
    "powershell",
    "api",
    "rest",
    "networking",
    "vpn",
    "wifi",
    "active directory",

    # Onboarding / Offboarding
    "onboarding",
    "offboarding",
    "documentation",
    "knowledge base",
]

def extract_skills_from_text(text: str) -> List[str]:
    """
    Very simple helper to detect which of the known skills appear in a block of text.
    Used for both:
      - Parsed CV text
      - Job descriptions
    """
    if not text:
        return []

    lowered = text.lower()
    found: List[str] = []

    for skill in SKILL_KEYWORDS:
        if skill.lower() in lowered:
            found.append(skill)

    return found

def extract_skills(text: str) -> List[str]:
    """
    Backwards-compatible wrapper so existing code that imports `extract_skills`
    from this module still works.
    """
    return extract_skills_from_text(text)


def extract_experience(text: str):
    # Very simple starter pattern: lines that look like job titles
    experience = []

    lines = text.split("\n")
    for line in lines:
        if any(keyword in line.lower() for keyword in ["assistant", "engineer", "developer", "intern", "manager"]):
            experience.append(line.strip())

    return experience


