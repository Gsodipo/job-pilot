🚀 JobPilot – Your AI Job Search Co-Pilot

JobPilot is an AI-enhanced job application assistant that helps users upload their CV, analyse job descriptions, match skills, and generate tailored cover letters.
It is built with FastAPI, React + TypeScript, MongoDB, and integrates with semantic AI models.

✨ Current MVP Features (v1)
1. CV Upload & Parsing

  Upload PDF CVs
  
  Automatic extraction of skills & experience
  
  Stored in MongoDB with unique cv_id
  
  Display parsed skills in UI

2. AI Job Matching Engine

  Compare CV against job description
  
  Compute:
  
  Match Score
  
  Skill Score
  
  Semantic Score
  
  Highlight:
  
  Overlapping skills
  
  Missing skills

3. Tracked Jobs Dashboard

  Save job matches automatically
  
  View all tracked matches for each CV
  
  See match scores, skills, missing skills
  
  Delete tracked jobs
  
  Fully working backend + UI

4. Cover Letter Generator (Template-Based v1)

  Generates structured cover letters
  
  Supports tones (professional, friendly, confident)
  
  Letters are editable in UI
  
  OpenAI integration planned for v2

🧱 Tech Stack
Backend (FastAPI)

Python 3.10+

FastAPI

PDFMiner / PyPDF2 (CV parsing)

OpenAI API (planned upgrade)

MongoDB (skills, job history, CV store)

Pydantic Models

Frontend (React + TypeScript)

React + TS

Vite

Axios

Custom JobPilot UI theme

Responsive layout

📂 Project Structure
job-pilot/
│
├── app/                # FastAPI backend
│   ├── api/            # Routes (upload, match, cover letters)
│   ├── schemas/        # Pydantic models
│   ├── services/       # Business logic
│   └── database.py     # MongoDB connection
│
├── frontend/           # React frontend
│   ├── src/
│   ├── public/
│   └── vite.config.js
│
└── README.md

🌱 Upcoming Features (v2 Roadmap)
🔜 OpenAI-powered Cover Letters

Generate highly personalised, role-aware letters

Understand job description context (FE, BE, Support, Cloud, etc.)

Replace template-based generator

🔜 UI Refactor

Split large App.tsx into components

Improve code readability and maintainability

🔜 Job Tracker Enhancements

Auto-refresh job list after match

Add timestamps and sorting

“Applied / Interview / Rejected” statuses

🔜 Authentication (Optional)

Multi-user support

Save CVs + history per account

🔜 Deployment

Backend → Render / Railway

Frontend → Netlify / Vercel

Public live demo link

👤 Author

Grant Sodipo
AI Developer • Full-Stack Engineer • Tech Innovator

GitHub: https://github.com/Gsodipo

🚀 Status

JobPilot v1 MVP is fully functional and now entering polish + AI-enhancement phase.
