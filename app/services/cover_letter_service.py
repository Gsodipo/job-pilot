from textwrap import dedent
from typing import Dict
from app.schemas.cover_letter_schema import CoverLetterRequest


def _summarise_experience(cv_doc: Dict) -> str:
    """Build a short summary sentence from the CV experience field."""
    experience = cv_doc.get("experience") or []
    if not experience:
        return "I have experience in technical and customer-facing roles that align with this position."

    # take first 2–3 lines max
    lines = [str(x) for x in experience[:3]]
    return "My background includes " + "; ".join(lines) + "."


def _summarise_skills(cv_doc: Dict) -> str:
    skills = cv_doc.get("skills") or []
    if not skills:
        return "I bring strong problem-solving skills and a willingness to learn quickly."
    # take top 6 skills
    top_skills = ", ".join(skills[:6])
    return f"Some of the key skills I would bring to this role are: {top_skills}."


def generate_cover_letter_text(cv_doc: Dict, req: CoverLetterRequest) -> str:
    """Generate a template-based cover letter using stored CV + job info."""
    exp_summary = _summarise_experience(cv_doc)
    skill_summary = _summarise_skills(cv_doc)

    tone = (req.tone or "professional").lower()

    opener = "I am excited to apply" if "enthusiastic" in tone else "I am writing to apply"

    letter = dedent(
        f"""
        Dear Hiring Manager,

        {opener} for the {req.job_title} position at {req.company}. After reviewing the job description, 
        I believe my background and experience make me a strong fit for this opportunity.

        {exp_summary}
        {skill_summary}

        In your job description, you highlight the importance of:
        - {req.job_description[:220]}...

        I am confident that I can quickly ramp up, collaborate effectively with your team, and contribute 
        to delivering a great experience for your users and stakeholders.

        Thank you for taking the time to review my application. I would welcome the opportunity to discuss 
        how my experience and skills can support {req.company}'s goals in more detail.

        Kind regards,
        [Your Name]
        """
    ).strip()

    return letter
