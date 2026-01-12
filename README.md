# 🚀 JobPilot — AI Job Search Co-Pilot

![Web App](https://img.shields.io/badge/Web%20App-Live-brightgreen)
![API](https://img.shields.io/badge/API-Production-blue)
![Chrome Extension](https://img.shields.io/badge/Chrome%20Extension-Developer%20Preview-orange)


**JobPilot** is an AI-powered job application assistant that streamlines the job search process by combining CV parsing, job matching, job tracking, and AI-assisted cover letter generation into a single end-to-end workflow.

**Status:** Portfolio-ready functional prototype (v1.0)

---

## ✨ Overview

JobPilot helps candidates:

- Upload and parse CVs
- Match CVs against real job descriptions
- Track job applications
- Generate tailored cover letters
- Save jobs directly from job boards using a Chrome extension

This is a **fully deployed, production-style system**, not a mock project.

---

## 📄 CV Upload & Parsing

- Upload a **PDF CV**
- Automatically extracts:
  - Skills
  - Experience highlights
- Generates a unique `cv_id`
- Stores parsed CV data in MongoDB
- Displays detected skills in the UI

---

## 🔍 Job Matching Engine

- Paste or extract a job description
- Computes:
  - Overall Match Score
  - Semantic Similarity Score
  - Skill Match Score
- Highlights:
  - Job-required skills
  - Overlapping skills
  - Missing skills
- Each match is:
  - Persisted
  - Linked to a CV
  - Tracked over time

---

## 🗂 Tracked Job History

- Persistent job tracking per `cv_id`
- Displays:
  - Job title
  - Company
  - Match percentage
  - Application status  
    *(Saved · Applied · Interview · Offer · Rejected)*
- Supported actions:
  - View previous matches
  - Update application status
  - Delete tracked jobs

---

## ✍️ AI Cover Letter Generator

- Generates tailored cover letters using:
  - CV content
  - Job description
  - Selected tone *(Professional / Enthusiastic / Confident)*
- Uses OpenAI API when available
- Automatic template fallback if AI is unavailable
- Safety features:
  - Prevents hallucinated skills
  - Uses “willingness to learn” language for missing skills
- Copy-to-clipboard support

---

## 🧩 Chrome Extension (Developer Preview)

> The JobPilot Chrome extension is currently available as a **Developer Preview** and must be installed manually using Chrome Developer Mode.

### Installation

1. Open Google Chrome and navigate to:
chrome://extensions

2. Enable **Developer mode** (toggle in the top-right corner).

3. Click **Load unpacked**.

4. Select the `chrome-extension/` folder from this repository.

5. The JobPilot extension will now appear in your extensions list and is ready to use.

---

### Supported Job Sites

The extension currently works best on:

- **LinkedIn**
- **Indeed** (partial support depending on layout)
- **Glassdoor** (manual text selection recommended)

> Job platforms frequently change their DOM structure, so extraction accuracy may vary.

---

### How It Works

- The Chrome extension communicates directly with the **production JobPilot backend API**.
- Your `cv_id` is stored locally so it only needs to be entered once.
- All job data, matches, and cover letters are saved via the backend — no sensitive data is stored by the extension itself.

---

### Why Developer Preview?

The extension is intentionally distributed this way because:

- It is an early-access feature
- It allows rapid iteration without Chrome Web Store review delays
- This approach is commonly used for **internal tools, demos, and engineering previews**

A public Chrome Web Store release may be considered in the future.

---
## 🚀 Quick Start (Web App + Chrome Extension)

This project is designed to be used with both the **web app** and the **Chrome extension** working together.

### Step 1 — Upload Your CV (Web App)
1. Open the JobPilot web app
2. Upload a PDF CV
3. Copy the generated `cv_id`

> The `cv_id` links all tracked jobs and cover letters to your CV.

---

### Step 2 — Save the CV ID (Chrome Extension)
1. Open the JobPilot Chrome extension
2. Paste your `cv_id`
3. Click **Save CV ID**

> This only needs to be done once per browser.

---

### Step 3 — Extract & Save a Job (Job Board)
1. Open a job listing on LinkedIn / Indeed / Glassdoor
2. Open the Chrome extension
3. Click **Extract from page**
   - Or use **Use selected text** if extraction fails
4. Click **Save tracked job**

> This saves the job and runs the matching engine automatically.

---

### Step 4 — Generate a Cover Letter
- Use either:
  - The **web app**, or
  - The **Chrome extension**
- Select a tone and generate a tailored cover letter

---
### Step 5 — View Tracked Jobs (Web App)

1. Return to the JobPilot web app
2. Click **Load Tracked Jobs**
3. Your saved job will appear in the tracked jobs list

> From here, you can view match results, generate cover letters, and manage application status.

---
### Step 6 — View a Tracked Job

1. In the **Tracked Jobs** section, click **View** on any saved job
2. JobPilot will:
   - Reload the job details
   - Re-run the match analysis
   - Display the latest match results
   - Load the most recent cover letter (if one exists)

> This allows you to revisit previous applications and continue where you left off.


## 🧠 Architecture

Chrome Extension ─┐
├──▶ FastAPI Backend ───▶ MongoDB Atlas
React Frontend ───┘

- Frontend and Chrome extension share the same backend API
- All data is persisted centrally
- Single source of truth via MongoDB

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- TypeScript

### Backend
- Python 3
- FastAPI
- MongoDB Atlas
- OpenAI API (optional)

### Browser Extension
- Chrome Extension (Manifest v3)
- Content scripts + popup UI
- Local storage for persistence

---

## 🎨 UX & Product Design

- Two-column layout:
  - Left → Inputs & controls
  - Right → Results, history, cover letter
- Sticky results panel
- Clear loading, empty, and error states
- Buttons disabled to prevent invalid actions
- Clean, reusable components

---

## 🔐 Security & Configuration

- API keys stored in environment variables
- `.env` excluded from version control
- `.env.example` included
- No secrets committed to GitHub

---
Licensed under the MIT License.

---

## ▶️ Run Locally

### Backend

```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

Frontend:
cd frontend
npm install
npm run dev


⚠️ Known Limitations
  - Job site DOM structures change frequently
  
  - LinkedIn extraction works best
  
  - Indeed works partially depending on layout
  
  - Glassdoor often requires manual text selection
  
  - Company name extraction is not guaranteed
  
  - These are expected limitations due to frequent UI changes on job platforms.

💡 Why JobPilot?
  - Job applications are repetitive, time-consuming, and inefficient.
  
  - JobPilot demonstrates how AI can be used responsibly to assist — not replace — human decision-making in the job search process.
  
 This project showcases:
  
  - Full-stack system design
  
  - API design & integration
  
  - State management
  
  - AI feature integration
  
  - Real-world deployment challenges
  
  - End-to-end production thinking

👤 Author
Grant Sodipo
Aspiring Software Engineer / IT Professional

GitHub: https://github.com/Gsodipo
