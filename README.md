🚀 JobPilot – AI-Powered Job Application Automation (Backend)

JobPilot is an AI-driven automation tool designed to analyze CVs, score job matches, and help users apply to jobs faster and smarter.
This repository contains the full backend built with FastAPI + MongoDB, including CV upload, parsing, job matching, and scoring logic.

🔥 Features
✅ 1. CV Upload & Parsing

Upload PDF CVs via /upload_cv

Extract:

Parsed text

Technical skills

Work experience

Store CVs in MongoDB for later matching

✅ 2. Job Matching API

Analyse a job description + stored CV

Extract skills from job description

Compute:

Semantic score (TF-IDF cosine similarity)

Skill score (overlap vs missing skills)

Final match score (weighted)

Identify:

overlapping_skills

missing_skills

✅ 3. MongoDB Integration

Stores CVs with metadata

Fast lookup for job matching

Clean, modular repository structure

✅ 4. Fully Documented Swagger API

Access at:

http://127.0.0.1:8000/docs

🛠️ Tech Stack
Component	Technology
Backend Framework	FastAPI
Language	Python
Database	MongoDB (Motor async driver)
Parsing Engine	PyPDF / custom text extractor
Matching Logic	TF-IDF + cosine similarity
Architecture	Modular service/repository layout
📡 API Endpoints
📄 1. Upload CV

POST /upload_cv
Upload a PDF and store parsed CV in MongoDB.

Response example:

{
  "cv_id": "692c634eb6a0e2ce9b65b0ec",
  "file_name": "Grant_CV.pdf",
  "skills": ["python", "sql", "linux"],
  "experience": ["Software Engineer Intern", "IT Support Technician"]
}

🔍 2. Match Job to CV

POST /jobs/match

Request example:

{
  "cv_id": "692c634eb6a0e2ce9b65b0ec",
  "job_title": "Application Support Engineer",
  "company": "ExampleCorp",
  "job_description": "Looking for someone with Python, SQL, REST APIs, troubleshooting..."
}


Response example:

{
  "cv_id": "692c634eb6a0e2ce9b65b0ec",
  "job_title": "Application Support Engineer",
  "company": "ExampleCorp",
  "match_score": 22.5,
  "semantic_score": 0.18,
  "skill_score": 0.5,
  "job_skills": ["python", "sql", "rest apis", "troubleshooting"],
  "overlapping_skills": ["python", "sql"],
  "missing_skills": ["rest apis", "troubleshooting"]
}

📁 Project Structure
jobpilot-backend/
│── app/
│   ├── api/
│   │   ├── cv_routes.py
│   │   └── job_routes.py
│   ├── services/
│   │   ├── cv_parser.py
│   │   └── cv_repository.py
│   ├── core/
│   │   └── database.py
│   └── models/
│
│── main.py
│── requirements.txt
│── README.md

🚀 How to Run Locally
1. Clone the repo
git clone https://github.com/Gsodipo/job-pilot.git
cd job-pilot

2. Create virtual environment
python -m venv venv
source venv/bin/activate   # (Mac/Linux)
venv\Scripts\activate      # (Windows)

3. Install dependencies
pip install -r requirements.txt

4. Start the server
uvicorn main:app --reload

5. Open API documentation
http://127.0.0.1:8000/docs

🧭 Next Steps (Roadmap)

Phase 3 → AI Cover Letter Generator

Phase 4 → Improved semantic embeddings (OpenAI)

Phase 5 → Frontend dashboard integration

Phase 6 → Browser extension for auto-applying

🏆 Author

Grant Sodipo — Building AI-powered tools that automate job applications.
GitHub: https://github.com/Gsodipo
