import { useRef, useState } from "react";
import "./App.css";
import logo from "./assets/jobpilot-logo.png";


import type { CvUploadResponse, JobMatchResponse, TrackedJob } from "./types";

import {
  uploadCv,
  matchJob,
  loadTrackedJobs,
  generateCoverLetter,
  getLatestCoverLetter,
} from "./api/endpoints";

import UploadCvCard from "./components/UploadCvCard";
import JobMatchCard from "./components/JobMatchCard";
import CoverLetterControls from "./components/CoverLetterControls";
import MatchResultCard from "./components/MatchResultCard";
import TrackedJobsCard from "./components/TrackedJobsCard";
import CoverLetterOutputCard from "./components/CoverLetterOutputCard";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  UserButton,
} from "@clerk/clerk-react";

/** ----------------------------
 *  Protected App Shell (Signed-in)
 *  ---------------------------- */
function JobPilotDashboard() {

  const rightPanelRef = useRef<HTMLDivElement | null>(null);

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvInfo, setCvInfo] = useState<CvUploadResponse | null>(null);

  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [matchResult, setMatchResult] = useState<JobMatchResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [trackedJobs, setTrackedJobs] = useState<TrackedJob[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);

  const [tone, setTone] = useState("professional");
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [coverLetterMode, setCoverLetterMode] = useState<
    "openai" | "template" | "none" | null
  >(null);
  const [coverLetterNote, setCoverLetterNote] = useState<string | null>(null);
  const [coverLoading, setCoverLoading] = useState(false);

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [, setCoverCache] = useState<Record<string, string>>({});

  const cvReady = !!cvInfo;

  const handleUploadCv = async () => {
    if (!cvFile) return setError("Please choose a PDF CV first.");

    try {
      setError(null);
      setLoading(true);

      const data = await uploadCv(cvFile);

      setCvInfo(data);
      setMatchResult(null);
      setTrackedJobs([]);
      setCoverLetter("");
      setCoverLetterMode(null);
      setCoverLetterNote(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error uploading CV");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadTrackedJobs = async () => {
    if (!cvInfo) return setError("Upload a CV first to load tracked jobs.");

    try {
      setError(null);
      setJobsLoading(true);

      const data = await loadTrackedJobs(cvInfo.cv_id);
      setTrackedJobs(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error loading tracked jobs");
    } finally {
      setJobsLoading(false);
    }
  };

  const canGenerate =
    !!cvInfo &&
    jobTitle.trim().length > 0 &&
    company.trim().length > 0 &&
    jobDescription.trim().length > 0;

  const handleMatchJob = async () => {
    if (!cvInfo) return setError("Upload a CV first so we know which cv_id to use.");
    if (!jobTitle || !company || !jobDescription)
      return setError("Fill in job title, company and description.");

    try {
      setError(null);
      setLoading(true);

      const data = await matchJob({
        cv_id: cvInfo.cv_id,
        job_title: jobTitle,
        company,
        job_description: jobDescription,
      });

      setMatchResult(data);
      setSelectedJobId(data.tracked_job_id ?? null);
      setCoverLetter("");
      setCoverLetterMode(null);
      setCoverLetterNote(null);

      await handleLoadTrackedJobs();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error matching job");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!selectedJobId)
      return setError("Select a tracked job (click View) before generating a cover letter.");
    if (!cvInfo) return setError("Upload a CV first so we know which cv_id to use.");
    if (!jobTitle || !company || !jobDescription)
      return setError("Fill in job title, company and job description to generate a cover letter.");

    try {
      setError(null);
      setCoverLoading(true);

      const data = await generateCoverLetter({
        cv_id: cvInfo.cv_id,
        job_id: selectedJobId!,
        job_title: jobTitle,
        company,
        job_description: jobDescription,
        tone,
      });

      setCoverLetter(data.cover_letter);
      setCoverLetterMode(data.mode);
      setCoverLetterNote(data.note ?? null);

      if (selectedJobId) {
        setCoverCache((prev) => ({ ...prev, [selectedJobId]: data.cover_letter }));
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error generating cover letter");
    } finally {
      setCoverLoading(false);
    }
  };

  const handleViewTrackedJob = async (job: TrackedJob) => {
    setSelectedJobId(job.id);

    setJobTitle(job.job_title);
    setCompany(job.company);
    setJobDescription(job.job_description ?? "");

    setCoverLetter("");
    setCoverLetterMode(null);
    setCoverLetterNote(null);
    setMatchResult(null);

    if (!cvInfo) return setError("Upload a CV first.");
    if (!job.job_description) return setError("This tracked job is missing a job description.");

    try {
      setError(null);
      setLoading(true);

      const data = await matchJob({
        cv_id: cvInfo.cv_id,
        job_title: job.job_title,
        company: job.company,
        job_description: job.job_description,
      });
      setMatchResult(data);

      const saved = await getLatestCoverLetter(job.id);
      setCoverLetter(saved.cover_letter ?? "");
      setCoverLetterMode((saved.mode as any) ?? null);
      setCoverLetterNote(saved.note ?? null);

      setTimeout(() => {
        document.getElementById("match-result")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error loading tracked job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="jp-app">
      <header className="jp-header">
        <img src={logo} alt="JobPilot logo" className="jp-header-logo" />
        <div>
          <div className="jp-header-title">JobPilot</div>
          <div className="jp-header-tagline">Your AI job search co-pilot</div>
        </div>

        {/* ✅ Clerk user menu */}
        <div style={{ marginLeft: "auto" }}>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main className="jp-main">
        {error && (
          <div className="jp-alert jp-alert-error">
            <span>{error}</span>
          </div>
        )}
        {loading && (
          <div className="jp-alert jp-alert-info">
            <span>Working on it…</span>
          </div>
        )}

        <div className="jp-layout">
          <div className="jp-left">
            <UploadCvCard
              cvFile={cvFile}
              setCvFile={setCvFile}
              cvInfo={cvInfo}
              loading={loading}
              onUpload={handleUploadCv}
            />

            <JobMatchCard
              cvReady={cvReady}
              jobTitle={jobTitle}
              setJobTitle={setJobTitle}
              company={company}
              setCompany={setCompany}
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              loading={loading}
              onMatch={handleMatchJob}
            />

            <CoverLetterControls
              cvReady={cvReady}
              tone={tone}
              setTone={setTone}
              coverLoading={coverLoading}
              onGenerate={handleGenerateCoverLetter}
              canGenerate={canGenerate}
            />

            {coverLetterMode && (
              <div className="jp-status" style={{ marginTop: -10 }}>
                Mode: <code>{coverLetterMode}</code>
                {coverLetterNote ? (
                  <>
                    {" "}
                    · <span className="jp-hint">{coverLetterNote}</span>
                  </>
                ) : null}
              </div>
            )}
          </div>

          <div className="jp-right" ref={rightPanelRef}>
            <MatchResultCard matchResult={matchResult} />

            <TrackedJobsCard
              cvReady={cvReady}
              jobsLoading={jobsLoading}
              trackedJobs={trackedJobs}
              onLoad={handleLoadTrackedJobs}
              onView={handleViewTrackedJob}
            />

            <CoverLetterOutputCard coverLetter={coverLetter} />
          </div>
        </div>
      </main>
    </div>
  );
}

/** ----------------------------
 *  Router + Auth Gate
 *  ---------------------------- */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <JobPilotDashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />

        <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
        <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
      </Routes>
    </BrowserRouter>
  );
}
