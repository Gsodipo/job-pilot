🚀 JobPilot – Your AI Job Search Co-Pilot

JobPilot is an AI-powered job application assistant that helps users upload their CV, analyze skills, match job descriptions, and generate tailored cover letters.
It acts as an intelligent co-pilot to navigate the job search process faster and more effectively.

This project includes both the FastAPI backend and the Vite + React frontend.

📌 Features
🔹 CV Upload & Parsing

Upload PDF CVs.

Automatic text extraction and skill detection.

Secure storage of parsed data in MongoDB.

🔹 AI Job Matching Engine

Compares CV skills against job descriptions.

Computes:

Match Score

Skill Score

Semantic Score

Highlights:

Overlapping skills

Missing skills

Extracted job keywords

🔹 Cover Letter Generator

Generates professional cover letters tailored to the job.

Supports multiple tones and formatting options.

🔹 Job Tracking

Saves previous job matches in the database.

View job match history.

Delete tracked jobs.

🔹 Frontend UI (Vite + React)

Upload CV page

Job match form

Results display

Clean modern UI matching the JobPilot brand

🛠️ Tech Stack
Backend

🐍 Python 3.10+

⚡ FastAPI

📄 PyPDF2 / PDFMiner (CV parsing)

🧠 OpenAI API (Semantic scoring & cover letters)

🍃 MongoDB (Data storage)

🔑 Pydantic models

Frontend

⚛️ React + TypeScript

⚡ Vite

🎨 Custom CSS (JobPilot UI theme)

🔗 Axios (API calls)

📂 Project Structure
job-pilot/
│
├── app/                 # Backend FastAPI application
│   ├── api/             # Routes (CV upload, job matching, cover letters)
│   ├── schemas/         # Pydantic models
│   ├── services/        # Business logic (matching, CV parsing)
│   └── database.py      # MongoDB connection
│
├── main.py              # FastAPI entry point
├── requirements.txt     # Backend dependencies
│
├── frontend/            # Vite + React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md            # This file

⚙️ Setup Instructions
1️⃣ Backend Setup
cd job-pilot
pip install -r requirements.txt
uvicorn main:app --reload


Backend runs at:

👉 http://127.0.0.1:8000

Swagger Docs:
👉 http://127.0.0.1:8000/docs

2️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs at:

👉 http://localhost:5173

🔌 API Endpoints (Summary)
CV
Method	Endpoint	Description
POST	/upload_cv	Upload CV (PDF)
Job Matching
Method	Endpoint	Description
POST	/jobs/match	Compute job match scores
GET	/jobs/history/{cv_id}	Get job match history
GET	/jobs	List all tracked jobs
DELETE	/jobs/{job_id}	Delete a tracked job
Cover Letters
Method	Endpoint	Description
POST	/cover-letter/generate	Generate cover letter
🎨 JobPilot Branding

Primary Color: #1A8FBF
Secondary Color: #06384A
Accent: #12D4A6

Typography & UI are designed to match the JobPilot logo and brand identity.

🧱 Current Status

This repository contains:

✔ Fully working backend (CV parsing, matching, history)

✔ Early-stage frontend (upload CV + job match UI)

✔ Clean project structure ready to deploy or extend

✔ Full GitHub integration and version control

🛣️ Roadmap

🔲 Cover letter UI page

🔲 “Saved Jobs” dashboard

🔲 Add user authentication (optional)

🔲 Deploy backend to Render / Railway

🔲 Deploy frontend to Netlify / Vercel

🔲 Chrome extension for auto-applying

🔲 Make JobPilot a fully automated job assistant

👤 Author

Grant Sodipo
AI Developer • Full-Stack Engineer • Tech Innovator
GitHub: https://github.com/Gsodipo
