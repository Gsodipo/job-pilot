🚀 JobPilot — AI Job Search Co-Pilot

JobPilot is an AI-powered job application assistant that helps users upload a CV, match it against job descriptions, track past matches, and generate tailored cover letters.
The goal of JobPilot is to reduce friction in the job application process by combining CV parsing, semantic matching, and AI-generated content in one clean interface.

⚠️ Current status: Functional prototype (actively evolving)

⸻

🧠 What JobPilot Does (Current Features)

✅ CV Upload & Parsing
	•	Upload a PDF CV
	•	Extracts:
	•	Skills
	•	Experience highlights
	•	Stores parsed CV with a unique cv_id
	•	Displays detected skills in the UI

⸻

✅ Job Matching Engine
	•	Paste a job description
	•	Computes:
	•	Match Score
	•	Semantic Score
	•	Skill Score
	•	Highlights:
	•	Job skills
	•	Overlapping skills
	•	Missing skills
	•	Results are saved and tracked per CV

⸻

✅ Tracked Job History
	•	View all previously matched jobs for a CV
	•	Stored per cv_id
	•	Displays:
	•	Job title
	•	Company
	•	Match percentage
	•	Semantic score
	•	Overlapping skills
	•	Missing skills
	•	View button:
	•	Reloads a previous match into the results panel
	•	Auto-fills job title & company for reuse

⸻

✅ AI Cover Letter Generator (OpenAI)
	•	Generates tailored cover letters using:
	•	CV skills
	•	Job description
	•	Selected tone (Professional / Friendly / Enthusiastic)
	•	Uses OpenAI when enabled, with a fallback template mode
	•	Displays generation mode (openai or template)
	•	Copy-to-clipboard supported
	•	Safe guards:
	•	No hallucinated skills
	•	Willingness-to-learn phrasing for missing skills

⸻

🎨 Frontend UX Highlights
	•	Two-column layout
	•	Left: inputs & controls
	•	Right: results, history, cover letter
	•	Sticky results panel for better usability
	•	Clean, modern UI with reusable components
	•	Button disabling logic to prevent invalid actions
	•	Clear error and loading states

⸻

🧩 Frontend Architecture

The frontend has been refactored for maintainability and scalability.

Component Structure
src/
├── components/
│   ├── UploadCvCard.tsx
│   ├── JobMatchCard.tsx
│   ├── CoverLetterControls.tsx
│   ├── MatchResultCard.tsx
│   ├── TrackedJobsCard.tsx
│   └── CoverLetterOutputCard.tsx
│
├── api/
│   ├── client.ts        # Axios instance
│   └── endpoints.ts     # API calls
│
├── types.ts             # Shared TypeScript interfaces
├── App.tsx              # App state orchestration

🛠️ Backend Overview

Tech Stack
	•	Python 3
	•	FastAPI
	•	MongoDB
	•	OpenAI API

Key Backend Responsibilities
	•	CV PDF parsing
	•	Skill & experience extraction
	•	Job matching & scoring
	•	Job history persistence
	•	Cover letter generation with OpenAI
	•	Safe environment variable handling (.env ignored)

⸻

🔐 Security & Configuration
	•	API keys stored in environment variables
	•	.env excluded from version control
	•	.env.example included for setup
	•	No secrets committed to GitHub

⸻

▶️ How to Run Locally

Backend:

cd jobpilot-backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

Frontend : 
cd frontend
npm install
npm run dev

📌 Current Project Status
	•	Stage: Functional prototype
	•	Completion: ~70–75%
	•	Focus: Stability, UX flow, and persistence

This version is portfolio-ready and demonstrates:
	•	Full-stack architecture
	•	State management
	•	API integration
	•	AI feature integration
	•	Clean UI design

⸻

🛣️ Roadmap (Next Steps)

Short Term
	•	Persist generated cover letters
	•	View historical cover letters per job
	•	Delete tracked jobs
	•	Export cover letters (.txt)

Medium Term
	•	Backend validation hardening
	•	Basic API tests
	•	Improved empty states

Long Term
	•	Deployment (Vercel + Render/Railway)
	•	Live demo link
	•	Optional job API integration (non-scraping)

⸻

💡 Why JobPilot?

JobPilot was built to solve a real problem:

Job applications are repetitive, time-consuming, and poorly optimized.

This project demonstrates how AI can be used responsibly to support — not replace — human decision-making in the job search process.

⸻

👤 Author

Grant Sodipo
Aspiring Software Engineer / IT Professional
Building real-world, portfolio-driven projects


