1️⃣ README.md (project overview)
# JobPilot

JobPilot is an AI-assisted job application tool that helps you:

- Upload and parse your CV
- Extract key skills and experience
- Store CVs in a database for reuse
- (Planned) Match your CV to job descriptions using TF-IDF + cosine similarity
- (Planned) Generate tailored cover letters
- (Planned) Track job applications and statuses

> Status: **Backend MVP in progress** – CV upload, parsing, and MongoDB integration are implemented.

---

## 🚀 Tech Stack

**Backend**

- Python 3
- FastAPI
- Uvicorn
- MongoDB (Community Server)
- Motor (async MongoDB driver)
- PyMuPDF (PDF parsing)
- Pydantic
- python-dotenv

**Frontend** (planned)

- React (Vite or CRA)
- TypeScript
- TailwindCSS (or similar)

**AI (planned)**

- OpenAI / other LLM API for:
  - Cover letter generation
  - Enhanced job match explanations

---

## 📂 Project Structure (Backend)

Current backend layout:

```text
jobpilot-backend/
├── main.py
├── requirements.txt
├── .env                # NOT committed – local only
└── app/
    ├── api/
    │   └── cv_routes.py
    ├── core/
    │   └── database.py
    ├── schemas/
    │   └── cv_schema.py
    └── services/
        ├── cv_parser.py
        └── cv_repository.py

✅ Implemented Features (Backend)
1. Health Check

GET /health

Returns a simple JSON payload to confirm the backend is running:

{
  "status": "ok",
  "app": "JobPilot backend is running 🎯"
}

2. CV Upload & Parsing

POST /upload_cv

Accepts a CV as a PDF file.

Uses PyMuPDF to extract plain text from the PDF.

Runs simple NLP helpers to extract:

A list of skills (based on a keyword vocabulary)

Basic experience lines (very early heuristic)

Stores the CV in MongoDB (jobpilot.cvs collection).

Returns:

{
  "cv_id": "<MongoDB document id>",
  "file_name": "MyCV.pdf",
  "skills": ["Python", "Linux", "..."],
  "experience": [
    "Customer Support Assistant – ...",
    "Software Engineer Intern – ..."
  ]
}


This cv_id will be used later by the job-matching and cover-letter endpoints.

🧰 Setup & Installation
1. Clone the repository
git clone https://github.com/Gsodipo/job-pilot.git
cd job-pilot/jobpilot-backend

2. Create and activate a virtual environment (optional but recommended)
python -m venv venv
venv\Scripts\activate   # Windows

# On macOS / Linux:
# source venv/bin/activate

3. Install dependencies
pip install -r requirements.txt

4. Configure environment variables

Create a .env file in jobpilot-backend/:

MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=jobpilot


.env is ignored by git via .gitignore.

5. Run MongoDB

Install MongoDB Community Server and ensure the service is running:

Service name: MongoDB Server (MongoDB)

Default URI: mongodb://localhost:27017

6. Run the backend

From jobpilot-backend/:

python -m uvicorn main:app --reload


Open:

Docs: http://127.0.0.1:8000/docs

Health check: http://127.0.0.1:8000/health

🧪 Quick Manual Test

Start the backend.

Navigate to http://127.0.0.1:8000/docs.

Use POST /upload_cv:

Click Try it out

Upload a PDF CV

Click Execute

You should receive a JSON response containing:

cv_id

skills

experience

🗺️ Roadmap

Planned next steps:

 Implement /match_job endpoint:

Fetch CV by cv_id

Use TF-IDF + cosine similarity for semantic matching

Combine with skill overlap scoring

 Add cover letter generation endpoint using an LLM API

 Build React frontend:

CV upload page

Job match page

Cover letter preview / copy / download

 Job application tracker dashboard

 Chrome/Edge extension to scrape job postings and send them to JobPilot API

👨‍💻 Author

Built by Grant (Gsodipo) as a personal project to automate and improve the job application process, while practicing:

Backend development with FastAPI

Working with MongoDB

Building AI-powered developer tools


---

## 2️⃣ `docs/plan.md` (optional but very useful)

Create a `docs` folder in the repo root, then create `docs/plan.md`:

```markdown
# JobPilot – Development Plan

## Vision

JobPilot is an AI-assisted job application system that:
- Parses and stores CVs
- Matches them against job descriptions
- Generates tailored cover letters
- Tracks applications and statuses
- (Later) Automates some parts of applying

---

## Current Status (Day 1 Backend)

Implemented:

- FastAPI project setup
- Health check endpoint
- CV upload endpoint (`/upload_cv`)
- PDF parsing via PyMuPDF
- Simple skills + experience extraction
- MongoDB integration with `cvs` collection
- `cv_id` returned to the client

---

## Next Backend Milestones

### 1. Job Matching Engine

**Endpoint:** `POST /match_job`

Input:
- `cv_id`
- `job_title` (optional)
- `company` (optional)
- `job_description`

Logic:
- Fetch stored CV by `cv_id`
- Use TF-IDF + cosine similarity on:
  - CV text
  - Job description
- Extract job skills and compare against CV skills
- Combine:
  - 70% semantic score
  - 30% skill overlap score

Output:
- Overall `match_score` (0–100)
- `semantic_score`
- `skill_score`
- `job_skills`
- `overlapping_skills`
- `missing_skills`

---

### 2. Cover Letter Generation

**Endpoint:** `POST /generate_cover_letter`

Input:
- `cv_id`
- `job_title`
- `company`
- `job_description`
- Tone options (e.g. “professional”, “enthusiastic”) – optional

Logic:
- Fetch structured CV info (skills, experience)
- Build a strong prompt for an LLM
- Generate a 3–4 paragraph cover letter
- Return text + (later) DOCX/PDF export

---

### 3. Job Application Tracker

**Endpoints:**

- `POST /jobs` – add tracked job
- `GET /jobs` – list all jobs
- `PATCH /jobs/{id}` – update status / notes
- `DELETE /jobs/{id}` – remove job

Fields:

- `job_title`
- `company`
- `match_score` (optional)
- `status` (`Saved`, `Applied`, `Interview`, `Offer`, `Rejected`)
- `applied_date`
- `notes`

---

## Frontend Plan (React)

Pages:

1. **CV Upload Page**
   - Drag & drop or file picker
   - Show “parsed CV summary”: skills, experience count
   - Store `cv_id` in frontend state

2. **Job Match Page**
   - Textarea to paste job description
   - Optional fields: job title, company
   - Call `/match_job`
   - Show:
     - Big match % badge
     - Strengths (overlapping skills)
     - Gaps (missing skills)

3. **Cover Letter Page**
   - Uses same job description + `cv_id`
   - Calls `/generate_cover_letter`
   - Editable text area + copy button
   - (Later) Download as PDF/DOC

4. **Job Tracker Dashboard**
   - Table of jobs
   - Status editing
   - Filters (by status, company)

---

## Future Ideas

- Browser extension to scrape job postings and send them directly to JobPilot
- Analytics:
  - Applications per week
  - Interviews vs offers
- Templates:
  - Different cover letter “styles” per industry
- Multi-CV support:
  - Separate CVs for tech support, dev, data, etc.

---

## Notes

Development rules for this project:

- Core logic (matching, prompts, data models) is written by hand.
- AI tools (ChatGPT, Cursor, Copilot) are used only for:
  - Boilerplate
  - CRUD
  - UI scaffolding
  - Documentation
- `.env` and API keys are never committed.
