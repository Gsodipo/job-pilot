from textwrap import dedent
from typing import Dict
from app.schemas.cover_letter_schema import CoverLetterRequest
import re


import re

def _summarise_experience(cv_doc: Dict) -> str:
    """Create a clean, natural summary of CV experience with acronym protection."""
    experience = cv_doc.get("experience") or []

    if not experience:
        return (
            "I have hands-on experience in analytical work, problem-solving, and supporting technical projects."
        )

    cleaned = []

    for raw in experience[:3]:
        line = str(raw).strip()

        # Remove bullet characters
        for bullet in ["•", "-", "*"]:
            if line.startswith(bullet):
                line = line[len(bullet):].strip()

        # Replace "&" with "and"
        line = line.replace("&", "and")

        # Remove trailing punctuation
        line = line.rstrip(";").rstrip(".").strip()

        if len(line) < 10:
            continue

        # Split into words
        words = line.split()

        # LOWERCASE first word only — EXCEPT if it's an acronym
        first = words[0]
        if first.isupper() and len(first) <= 4:  # EDA, SQL, AWS, API
            pass
        else:
            first = first.lower()

        # Preserve acronyms in rest of sentence
        rest = []
        for w in words[1:]:
            if w.isupper() and len(w) <= 4:
                rest.append(w)  # keep acronyms uppercase
            else:
                rest.append(w.lower())

        line = " ".join([first] + rest)

        cleaned.append(line)

    if not cleaned:
        return "I have experience contributing to data-driven projects."

    # Remove repeated "and"
    summary = "; ".join(cleaned)
    summary = summary.replace(", and and", ", and")
    summary = summary.replace("and and", "and")

    # Capitalize first letter of final sentence
    summary = summary[0].upper() + summary[1:]

    return f"My experience includes {summary}, allowing me to contribute effectively from day one."





def _summarise_skills(cv_doc: Dict) -> str:
    """Return a polished summary of top skills."""
    skills = cv_doc.get("skills") or []
    if not skills:
        return "I bring strong analytical and problem-solving abilities."

    top = ", ".join(skills[:6])
    return f"Some of the key skills I bring include {top}."


def _summarise_job_description(text: str) -> str:
    """
    Converts job description into a general responsibilities bullet.
    Prevents copying the full description.
    """
    if not text:
        return "supporting data-driven decision making and collaborating with cross-functional teams."

    text = text.replace("\n", " ").strip()

    # Extract first meaningful sentence
    sentences = [s.strip() for s in text.split(".") if len(s.strip()) > 25]

    if not sentences:
        return "contributing to analytical tasks and improving business insights."

    first = sentences[0].lower()

    # Convert employer wording into a generic responsibility
    if "looking for" in first:
        first = first.split("looking for")[-1].strip()
    if "to join" in first:
        first = first.split("to join")[0].strip()

    # Beautify:
    return (
        "supporting data analysis, collaborating with stakeholders, and delivering actionable insights."
    )


def generate_cover_letter_text(cv_doc: Dict, req: CoverLetterRequest) -> str:
    """Generate a polished cover letter."""
    tone = (req.tone or "professional").lower()
    opener = "I am excited to apply" if tone in ("friendly", "enthusiastic") else "I am writing to apply"

    exp_summary = _summarise_experience(cv_doc)
    skill_summary = _summarise_skills(cv_doc)
    jd_summary = _summarise_job_description(req.job_description)

    letter = dedent(
        f"""
        Dear Hiring Manager,

        {opener} for the {req.job_title} position at {req.company}. After reviewing the role, 
        I believe my background and experience make me a strong fit for this opportunity.

        {exp_summary}
        {skill_summary}

        Based on the job description, the role emphasizes:
        - {jd_summary}

        I am confident that I can quickly contribute to your team, communicate effectively with stakeholders, 
        and deliver reliable, high-quality analytical output for {req.company}.

        Thank you for your time and consideration. I would welcome the opportunity to discuss 
        how my experience aligns with your needs.

        Kind regards,
        [Your Name]
        """
    ).strip()

    return letter
