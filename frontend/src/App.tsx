import { useState } from "react";
import "./App.css";
import logo from "./assets/jobpilot-logo.png";

import type {
  CvUploadResponse,
  JobMatchResponse,
  TrackedJob,
} from "./types";

import { uploadCv, matchJob, loadHistory, generateCoverLetter } from "./api/endpoints";

import UploadCvCard from "./components/UploadCvCard";
import JobMatchCard from "./components/JobMatchCard";
import CoverLetterControls from "./components/CoverLetterControls";
import MatchResultCard from "./components/MatchResultCard";
import TrackedJobsCard from "./components/TrackedJobsCard";
import CoverLetterOutputCard from "./components/CoverLetterOutputCard";

export default function App() {
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
  const [coverLetterMode, setCoverLetterMode] =
    useState<"openai" | "template" | null>(null);
  const [coverLetterNote, setCoverLetterNote] = useState<string | null>(null);
  const [coverLoading, setCoverLoading] = useState(false);

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

      const data = await loadHistory(cvInfo.cv_id);
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
    if (!cvInfo) return setError("Upload a CV first so we know which cv_id to use.");
    if (!jobTitle || !company || !jobDescription)
      return setError("Fill in job title, company and job description to generate a cover letter.");

    try {
      setError(null);
      setCoverLoading(true);

      setCoverLetter("");
      setCoverLetterMode(null);
      setCoverLetterNote(null);

      const data = await generateCoverLetter({
        cv_id: cvInfo.cv_id,
        job_title: jobTitle,
        company,
        job_description: jobDescription,
        tone,
      });

      setCoverLetter(data.cover_letter);
      setCoverLetterMode(data.mode);
      setCoverLetterNote(data.note ?? null);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error generating cover letter");
    } finally {
      setCoverLoading(false);
    }
  };

const handleViewTrackedJob = (job: TrackedJob) => {
  console.log("VIEW CLICKED (App):", job);

  // Update right panel content
  setMatchResult(job as any);

  // Refill left form (optional but good UX)
  setJobTitle(job.job_title);
  setCompany(job.company);

  // ✅ Scroll ONLY the right panel to the top
  setTimeout(() => {
    document
      .getElementById("right-panel")
      ?.scrollTo({ top: 0, behavior: "smooth" });
  }, 50);
};


  return (
    <div className="jp-app">
      <header className="jp-header">
        <img src={logo} alt="JobPilot logo" className="jp-header-logo" />
        <div>
          <div className="jp-header-title">JobPilot</div>
          <div className="jp-header-tagline">Your AI job search co-pilot</div>
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
              canGenerate={canGenerate} // ✅ add this
            />

            {coverLetterMode && (
              <div className="jp-status" style={{ marginTop: -10 }}>
                Mode: <code>{coverLetterMode}</code>
                {coverLetterNote ? <> · <span className="jp-hint">{coverLetterNote}</span></> : null}
              </div>
            )}
          </div>

          <div className="jp-right" id="right-panel">
            <MatchResultCard matchResult={matchResult} />

            <TrackedJobsCard
              cvReady={cvReady}
              jobsLoading={jobsLoading}
              trackedJobs={trackedJobs}
              onLoad={handleLoadTrackedJobs}
              onView={handleViewTrackedJob} // ✅ NEW
            />


            <CoverLetterOutputCard coverLetter={coverLetter} />
          </div>
        </div>
      </main>
    </div>
  );
}
