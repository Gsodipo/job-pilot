# 🚀 JobPilot — AI Job Search Co-Pilot

JobPilot is an AI-powered job application assistant that helps users upload a CV, match it against job descriptions, track applications, and generate tailored cover letters.

It is designed to **reduce friction in the job application process** by combining CV parsing, semantic matching, job tracking, and AI-generated content into one cohesive workflow.

> **Status:** Portfolio-ready functional prototype (v1.0)

---

## ✨ Key Features

### ✅ CV Upload & Parsing
- Upload a PDF CV
- Automatically extracts:
  - Skills
  - Experience highlights
- Stores CV data with a unique `cv_id`
- Displays detected skills in the UI

---

### ✅ Job Matching Engine
- Paste or extract a job description
- Computes:
  - Overall Match Score
  - Semantic Similarity Score
  - Skill Match Score
- Highlights:
  - Job-required skills
  - Overlapping skills
  - Missing skills
- Each match is saved and tracked per CV

---

### ✅ Tracked Job History
- Persistent job tracking per `cv_id`
- Displays:
  - Job title
  - Company
  - Match percentage
  - Application status (Saved, Applied, Interview, Offer, Rejected)
- Actions:
  - View previous matches
  - Update status
  - Delete tracked jobs

---

### ✅ AI Cover Letter Generator
- Generates tailored cover letters using:
  - CV content
  - Job description
  - Selected tone (Professional / Enthusiastic / Confident)
- Uses OpenAI when available, with a template fallback
- Safe-guarded to avoid hallucinated skills
- Willingness-to-learn phrasing for missing skills
- Copy-to-clipboard support

---

### ✅ Chrome Extension (MVP)
- Extracts job title and job description from job sites
- Stores `cv_id` locally so it only needs to be entered once
- Integrates directly with the backend:
  - Saves tracked jobs
  - Generates cover letters
- Includes:
  - “Extract from page”
  - “Use selected text” fallback for complex sites

---

## 🧠 Architecture (High-Level)

Chrome Extension ─┐
├──▶ FastAPI Backend ───▶ MongoDB
React Frontend ───┘

- Frontend and Chrome extension both communicate with the same backend API
- All data is persisted and shared across interfaces

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- TypeScript
- Modular component architecture

### Backend
- Python 3
- FastAPI
- MongoDB
- OpenAI API (optional)

### Browser Extension
- Chrome Extension (Manifest v3)
- Content scripts + popup UI
- Local storage for persistence

---

## 🎨 Frontend UX Highlights
- Two-column layout:
  - Left: inputs & controls
  - Right: results, history, cover letter
- Sticky results panel
- Clear loading, empty, and error states
- Button disabling to prevent invalid actions
- Clean, reusable component structure

---

## 🔐 Security & Configuration
- API keys stored in environment variables
- `.env` excluded from version control
- `.env.example` included for setup
- No secrets committed to GitHub

---

## ▶️ Run Locally

### Backend
```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
Frontend
bash
Copy code
cd frontend
npm install
npm run dev
Chrome Extension
Open chrome://extensions

Enable Developer mode

Click Load unpacked

Select the chrome-extension/ folder

⚠️ Known Limitations
Job site DOM structures vary significantly

LinkedIn extraction works best

Indeed works partially depending on layout

Glassdoor often requires manual text selection

Company name extraction is not guaranteed across all sites

These limitations are expected and documented due to frequent DOM changes on job platforms.

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
Deployment (Vercel + Render/Railway)

Public demo link

Optional job API integrations (non-scraping)

💡 Why JobPilot?
Job applications are repetitive, time-consuming, and poorly optimized.

JobPilot demonstrates how AI can be used responsibly to assist — not replace — human decision-making in the job search process.

This project showcases:

Full-stack system design

API integration

State management

AI feature integration

Practical problem solving

👤 Author
Grant Sodipo
Aspiring Software Engineer / IT Professional
Building real-world, portfolio-driven projects

GitHub: https://github.com/Gsodipo
