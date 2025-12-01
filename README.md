✅ UPDATED README.md (copy/paste into your repo)
# 🚀 JobPilot – AI Job Application Assistant (Backend)

JobPilot is an AI-assisted job application tool designed to make job searching faster, smarter, and less stressful.  
This backend MVP currently supports automated CV parsing, job-to-CV matching, and AI-powered cover letter generation.

The project is being built publicly to sharpen backend development skills (FastAPI, MongoDB, vector matching) while creating a genuinely useful tool for job seekers.

---

# 📌 Features (Current – Phase 3 Complete)

### ✅ **1. CV Upload & Parsing**
Upload a PDF CV and automatically extract:
- Full text
- Skills (keyword-based extraction)
- Experience lines
- File metadata  
Stored in MongoDB for reuse.

### ✅ **2. Job Matching Engine**
Given a CV ID and job description, JobPilot:
- Extracts job skills  
- Computes semantic similarity using **TF-IDF + cosine similarity**
- Measures skill overlap  
- Produces a **match score (0–100)**  
- Returns:
  - `semantic_score`
  - `skill_score`
  - `job_skills`
  - `overlapping_skills`
  - `missing_skills`

### ✅ **3. AI Cover Letter Generation**
Uses extracted CV data + job description to generate:
- A full tailored cover letter  
- Optional tone (e.g. *professional, enthusiastic*)  
- Fully structured paragraphs  
- Ready to copy/paste  

### 🔒 Fully structured JSON API responses for front-end or extension integration.

---

# 🛠️ Tech Stack

**Backend**
- FastAPI
- Python 3.12
- PyMuPDF (PDF parsing)
- scikit-learn (TF-IDF job matching)
- Motor (async MongoDB driver)
- MongoDB Community Server
- Pydantic

**AI Layer**
- OpenAI API (for cover letter generation)

**Frontend (Planned)**
- React + TypeScript
- TailwindCSS
- Job dashboard UI

**Browser Extension (Planned)**
- JavaScript (Manifest V3)
- Auto-scrape job descriptions → send to JobPilot API

---

# 📂 Project Structure



jobpilot-backend/
├── main.py
├── requirements.txt
├── .env # Local use only
└── app/
├── api/
│ ├── cv_routes.py
│ └── job_routes.py
├── core/
│ └── database.py
├── schemas/
│ ├── cv_schema.py
│ └── job_schema.py
└── services/
├── cv_parser.py
├── cv_repository.py
└── job_matcher.py


---

# 🔌 API Endpoints

## 🟢 Health Check


GET /health

**Response**
```json
{ "status": "ok", "app": "JobPilot backend is running 🎯" }

📄 Upload CV
POST /upload_cv


Response

{
  "cv_id": "<id>",
  "file_name": "CV.pdf",
  "skills": [...],
  "experience": [...]
}

🎯 Match Job to CV
POST /jobs/match


Request

{
  "cv_id": "<id>",
  "job_title": "Business Data Analyst",
  "company": "ExampleCorp",
  "job_description": "We are looking for..."
}


Response

{
  "match_score": 85.3,
  "semantic_score": 0.76,
  "skill_score": 0.90,
  "job_skills": [...],
  "overlapping_skills": [...],
  "missing_skills": [...]
}

📝 Generate Cover Letter
POST /jobs/generate_cover_letter


Response

{
  "cover_letter": "Dear Hiring Manager..."
}

🧪 Running Locally
1. Clone the repo
git clone https://github.com/Gsodipo/job-pilot.git
cd job-pilot/jobpilot-backend

2. Create & activate virtual environment

Windows:

python -m venv venv
venv\Scripts\activate


Linux/macOS:

source venv/bin/activate

3. Install dependencies
pip install -r requirements.txt

4. Create .env
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=jobpilot
OPENAI_API_KEY=yourkey

5. Start server
uvicorn main:app --reload

🗺️ Roadmap
Phase 4 — Job Tracker

Save jobs

Update statuses (Saved, Applied, Interview, Offer, Rejected)

Notes per application

Dashboard API

Phase 5 — Frontend

React CV upload page

Job matching UI

Cover letter editor

Application tracker dashboard

Phase 6 — Browser Extension

Auto-detect job postings (LinkedIn, Indeed, Glassdoor)

Extract job descriptions

Send to JobPilot API

Autofill job applications (stretch goal)

Phase 7 — Cloud Deployment

Deploy backend to AWS / Render / Railway

Use MongoDB Atlas

API authentication + rate limiting
