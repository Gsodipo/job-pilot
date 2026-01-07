🚀 JobPilot — AI Job Search Co-Pilot

JobPilot is an AI-powered job application assistant that helps candidates streamline their job search by combining CV parsing, job matching, job tracking, and cover letter generation into a single, end-to-end workflow.

This project was built as a real-world, production-style system, not a demo — and is fully deployed with a live frontend, backend API, database, and Chrome extension.

Status: Portfolio-ready functional prototype (v1.0)

✨ Core Features
📄 CV Upload & Parsing

Upload a PDF CV

Automatically extracts:

Skills

Experience highlights

Stores CV data with a unique cv_id

Displays detected skills in the UI

CV data persists across sessions

🔍 Job Matching Engine

Paste or extract job descriptions

Computes:

Overall Match Score

Semantic Similarity Score

Skill Match Score

Highlights:

Required job skills

Overlapping skills

Missing skills

Each job match is saved and tracked per CV

🗂 Tracked Job History

Persistent job tracking by cv_id

Displays:

Job title

Company

Match percentage

Application status
(Saved · Applied · Interview · Offer · Rejected)

Actions:

View previous matches

Update application status

Delete tracked jobs

✍️ AI Cover Letter Generator

Generates tailored cover letters using:

CV content

Job description

Selected tone (Professional / Enthusiastic / Confident)

Uses OpenAI API when available

Safe fallback to structured templates if AI is unavailable

Guardrails:

Avoids hallucinated skills

Uses “willingness to learn” phrasing for missing skills

Copy-to-clipboard support

🧩 Chrome Extension (MVP)

Works directly on job boards (e.g. LinkedIn, Indeed, Glassdoor)

Extracts:

Job title

Job description

Stores cv_id locally (entered once)

Integrates with the deployed backend:

Save tracked jobs

Generate cover letters

Includes fallbacks:

“Extract from page”

“Use selected text” for complex layouts

🧠 High-Level Architecture
Chrome Extension ─┐
                  ├──▶ FastAPI Backend ───▶ MongoDB
React Frontend ───┘


Frontend and Chrome extension communicate with the same backend API

All data is persisted and shared across interfaces

Single source of truth via MongoDB

🛠 Tech Stack
Frontend

React (Vite)

TypeScript

Modular component architecture

Backend

Python 3

FastAPI

MongoDB (Atlas)

OpenAI API (optional)

Browser Extension

Chrome Extension (Manifest v3)

Content scripts + popup UI

Local storage for persistence

🎨 UX Highlights

Clean two-column layout:

Left: inputs & controls

Right: results, history, cover letter

Sticky results panel

Clear loading, empty, and error states

Button disabling to prevent invalid actions

Reusable, maintainable component structure

🔐 Security & Configuration

API keys stored in environment variables

.env excluded from version control

.env.example included

No secrets committed to GitHub

▶️ Run Locally
Backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

Frontend
cd frontend
npm install
npm run dev

Chrome Extension

Open chrome://extensions

Enable Developer mode

Click Load unpacked

Select the chrome-extension/ folder

⚠️ Known Limitations

Job site DOM structures change frequently

LinkedIn extraction works best

Indeed works partially depending on layout

Glassdoor often requires manual text selection

Company name extraction is not guaranteed across all sites

These limitations are expected and documented due to frequent job board UI changes.

🛣 Roadmap
Short Term

Persist generated cover letters per job

View historical cover letters

Export cover letters (.txt)

Medium Term

Backend validation hardening

Basic API test coverage

Improved empty states

Long Term

Public Chrome Web Store release

User authentication

Optional job API integrations (non-scraping)

💡 Why JobPilot?

Job applications are repetitive, time-consuming, and poorly optimized.

JobPilot demonstrates how AI can responsibly assist — not replace — human decision-making in the job search process.

This project showcases:

Full-stack system design

API design & integration

State management

AI feature integration

Real-world deployment & debugging

End-to-end production thinking

👤 Author

Grant Sodipo
Aspiring Software Engineer / IT Professional
Building real-world, portfolio-driven systems

🔗 GitHub: https://github.com/Gsodipo
