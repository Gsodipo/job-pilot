import os
from typing import Dict, List
from openai import OpenAI

# Let the SDK read OPENAI_API_KEY from environment
client = OpenAI()

def _safe_list(x) -> List[str]:
    if not x:
        return []
    return [str(i).strip() for i in x if str(i).strip()]

def generate_cover_letter_llm(
    cv_doc: Dict,
    job_title: str,
    company: str,
    job_description: str,
    tone: str
) -> str:
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    skills = _safe_list(cv_doc.get("skills"))[:10]

    experience = _safe_list(cv_doc.get("experience"))[:6]
    experience = [e for e in experience if len(e) > 20]

    # Keep job description size reasonable
    job_description = (job_description or "").strip()
    if len(job_description) > 2000:
        job_description = job_description[:2000]

    prompt = f"""
You are an expert career assistant. Write a tailored cover letter in plain text.

Constraints:
- Tone: {tone}
- 180–240 words
- Plain text only (no markdown, no bullet points)
- Do NOT invent skills, tools, employers, or years of experience
- ONLY reference technologies explicitly listed in CV facts
- If a required job skill is missing from CV facts, mention willingness to learn instead
- Do NOT say "previous role" unless a role appears in experience highlights
- Do NOT copy sentences from the job description
- Keep content relevant to frontend/backend software engineering

Job:
Title: {job_title}
Company: {company}
Job Description: {job_description}

CV facts:
Skills: {", ".join(skills)}
Experience highlights: {" | ".join(experience)}

Output format:
- Start with "Dear Hiring Manager,"
- End with "Kind regards," then "[Your Name]"
""".strip()

    resp = client.responses.create(
        model=model,
        input=prompt,
        max_output_tokens=350,
    )

    return (resp.output_text or "").strip()
