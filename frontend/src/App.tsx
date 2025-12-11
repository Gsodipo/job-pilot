import { useState } from "react";
import axios from "axios";
import "./App.css";
import logo from "./assets/jobpilot-logo.png";

const API_BASE = "http://127.0.0.1:8000";

interface CvUploadResponse {
  cv_id: string;
  file_name: string;
  skills: string[];
  experience: string[];
}

interface JobMatchResponse {
  cv_id: string;
  job_title: string;
  company: string;
  match_score: number;
  semantic_score: number;
  skill_score: number;
  job_skills: string[];
  overlapping_skills: string[];
  missing_skills: string[];
}

interface CoverLetterResponse {
  cover_letter: string;
}

interface TrackedJob {
  cv_id: string;
  job_title: string;
  company: string;
  match_score: number;
  semantic_score: number;
  skill_score: number;
  job_skills: string[];
  overlapping_skills: string[];
  missing_skills: string[];
}

function App() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvInfo, setCvInfo] = useState<CvUploadResponse | null>(null);

  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [matchResult, setMatchResult] = useState<JobMatchResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // NEW: tracked jobs state
  const [trackedJobs, setTrackedJobs] = useState<TrackedJob[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);

  const [tone, setTone] = useState<"professional" | "friendly" | "confident">(
  "professional"
  );
  const [coverLetter, setCoverLetter] = useState("");
  const [coverLoading, setCoverLoading] = useState(false);

  // ---- Upload CV ----
  const handleUploadCv = async () => {
    if (!cvFile) {
      setError("Please choose a PDF CV first.");
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const formData = new FormData();
      formData.append("file", cvFile);

      const res = await axios.post<CvUploadResponse>(
        `${API_BASE}/upload_cv`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setCvInfo(res.data);
      setMatchResult(null); // clear old result
      setTrackedJobs([]);   // clear old history for previous CV
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Error uploading CV");
    } finally {
      setLoading(false);
    }
  };

  // ---- Match Job ----
  const handleMatchJob = async () => {
    if (!cvInfo) {
      setError("Upload a CV first so we know which cv_id to use.");
      return;
    }
    if (!jobTitle || !company || !jobDescription) {
      setError("Fill in job title, company and description.");
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const payload = {
        cv_id: cvInfo.cv_id,
        job_title: jobTitle,
        company,
        job_description: jobDescription,
      };

      const res = await axios.post<JobMatchResponse>(
        `${API_BASE}/jobs/match`,
        payload
      );

      setMatchResult(res.data);

      // after a successful match, refresh tracked jobs
      await loadTrackedJobs();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Error matching job");
    } finally {
      setLoading(false);
    }
  };

  // ---- Load tracked jobs for this CV ----
  const loadTrackedJobs = async () => {
    if (!cvInfo) {
      setError("Upload a CV first to load tracked jobs for that cv_id.");
      return;
    }

    try {
      setError(null);
      setJobsLoading(true);

      const res = await axios.get<TrackedJob[]>(
        `${API_BASE}/jobs/history/${cvInfo.cv_id}`
      );

      console.log("Tracked jobs:", res.data);
      setTrackedJobs(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Error loading tracked jobs");
    } finally {
      setJobsLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
  if (!cvInfo) {
    setError("Upload a CV first so we know which cv_id to use.");
    return;
  }

  // you can either reuse the match form fields or require them
  if (!jobTitle || !company || !jobDescription) {
    setError(
      "Fill in job title, company and job description to generate a cover letter."
    );
    return;
  }

  try {
    setError(null);
    setCoverLoading(true);
    setCoverLetter("");

    const payload = {
      cv_id: cvInfo.cv_id,
      job_title: jobTitle,
      company,
      job_description: jobDescription,
      tone, // "professional" | "friendly" | ...
    };

    const res = await axios.post<CoverLetterResponse>(
      `${API_BASE}/cover-letter/generate`,
      payload
    );

    setCoverLetter(res.data.cover_letter);
  } catch (err: any) {
    console.error(err);
    setError(
      err.response?.data?.detail || "Error generating cover letter"
    );
  } finally {
    setCoverLoading(false);
  }
};


  return (
    <div className="jp-app">
      {/* HEADER */}
      <header className="jp-header">
        <img src={logo} alt="JobPilot logo" className="jp-header-logo" />
        <div>
          <div className="jp-header-title">JobPilot</div>
          <div className="jp-header-tagline">Your AI job search co-pilot</div>
        </div>
      </header>

      <main className="jp-main">
        {/* STATUS BANNERS */}
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

        {/* ===== 1. UPLOAD CV SECTION ===== */}
        <section className="jp-section">
          <div className="jp-section-header">
            <span className="jp-section-step">1</span>
            <div>
              <div className="jp-section-title">Upload your CV</div>
              <div className="jp-section-subtitle">
                Upload a PDF CV. JobPilot will parse it into skills and
                experience that can be matched against job descriptions.
              </div>
            </div>
          </div>

          <div className="jp-card">
            <div className="jp-form-grid">
              <div className="jp-form-row">
                <label className="jp-label">CV file (PDF)</label>
                <div className="jp-upload-dropzone">
                  <input
                    type="file"
                    accept="application/pdf"
                    className="jp-input jp-upload-file-input"
                    onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                  />
                  <span className="jp-hint">
                    Drag &amp; drop your CV here, or click to browse.
                  </span>
                  {cvFile && (
                    <span className="jp-upload-selected">
                      Selected: <strong>{cvFile.name}</strong>
                    </span>
                  )}
                </div>

                <div className="jp-actions">
                  <button
                    className="jp-button jp-button-primary"
                    onClick={handleUploadCv}
                    disabled={loading}
                  >
                    Upload &amp; parse CV
                  </button>
                  {cvInfo && (
                    <div className="jp-status">
                      Parsed and stored as <code>{cvInfo.cv_id}</code>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {cvInfo && (
              <div className="jp-upload-details">
                <div className="jp-upload-meta">
                  <div>
                    <span className="jp-meta-label">File</span>
                    <span className="jp-meta-value">{cvInfo.file_name}</span>
                  </div>
                  <div>
                    <span className="jp-meta-label">CV ID</span>
                    <span className="jp-meta-value">{cvInfo.cv_id}</span>
                  </div>
                </div>

                {cvInfo.skills?.length > 0 && (
                  <div className="jp-skills-list">
                    <span className="jp-meta-label">Detected skills</span>
                    <div className="jp-skill-chips">
                      {cvInfo.skills.map((s) => (
                        <span key={s} className="jp-chip">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ===== 2. MATCH JOB SECTION ===== */}
        <section className="jp-section">
          <div className="jp-section-header">
            <span className="jp-section-step">2</span>
            <div>
              <div className="jp-section-title">Match a job</div>
              <div className="jp-section-subtitle">
                Paste a job description and see how well your CV fits it.
              </div>
            </div>
          </div>

          <div className="jp-card">
            {!cvInfo && (
              <p className="jp-hint">
                Upload a CV first so we can use its <code>cv_id</code>.
              </p>
            )}

            <div className="jp-form-grid jp-form-grid--two-col">
              <div className="jp-form-row">
                <label className="jp-label">Job title</label>
                <input
                  className="jp-input"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Junior Full-Stack Developer"
                />
              </div>

              <div className="jp-form-row">
                <label className="jp-label">Company</label>
                <input
                  className="jp-input"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Kaptea.io"
                />
              </div>
            </div>

            <div className="jp-form-grid" style={{ marginTop: 14 }}>
              <div className="jp-form-row">
                <label className="jp-label">Job description</label>
                <textarea
                  className="jp-textarea"
                  rows={7}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here…"
                />
              </div>
            </div>

            <div className="jp-actions">
              <button
                className="jp-button jp-button-primary"
                onClick={handleMatchJob}
                disabled={!cvInfo || loading}
              >
                Run match
              </button>
              {!cvInfo && (
                <button
                  type="button"
                  className="jp-button jp-button-ghost"
                  disabled
                >
                  CV required to run match
                </button>
              )}
            </div>

            {matchResult && (
              <div className="jp-match-result">
                <h3 className="jp-match-title">Match result</h3>

                <div className="jp-match-metrics">
                  <div className="jp-metric">
                    <span className="jp-metric-label">Match score</span>
                    <span className="jp-metric-value">
                      {matchResult.match_score.toFixed(1)}
                    </span>
                  </div>
                  <div className="jp-metric">
                    <span className="jp-metric-label">Semantic score</span>
                    <span className="jp-metric-value">
                      {matchResult.semantic_score.toFixed(3)}
                    </span>
                  </div>
                  <div className="jp-metric">
                    <span className="jp-metric-label">Skill score</span>
                    <span className="jp-metric-value">
                      {matchResult.skill_score.toFixed(3)}
                    </span>
                  </div>
                </div>

                <div className="jp-match-details">
                  <div>
                    <span className="jp-meta-label">Job skills</span>
                    <div className="jp-skill-chips">
                      {matchResult.job_skills.map((s) => (
                        <span key={s} className="jp-chip jp-chip-muted">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="jp-meta-label">Overlap</span>
                    <div className="jp-skill-chips">
                      {matchResult.overlapping_skills.length > 0 ? (
                        matchResult.overlapping_skills.map((s) => (
                          <span key={s} className="jp-chip jp-chip-good">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="jp-hint">No overlapping skills</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="jp-meta-label">Missing</span>
                    <div className="jp-skill-chips">
                      {matchResult.missing_skills.length > 0 ? (
                        matchResult.missing_skills.map((s) => (
                          <span key={s} className="jp-chip jp-chip-bad">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="jp-hint">No missing skills 🎉</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ===== 3. TRACKED JOBS SECTION ===== */}
        <section className="jp-section">
          <div className="jp-section-header">
            <span className="jp-section-step">3</span>
            <div>
              <div className="jp-section-title">Tracked jobs</div>
              <div className="jp-section-subtitle">
                View jobs you’ve already matched for this CV.
              </div>
            </div>
          </div>

          <div className="jp-card">
            {!cvInfo && (
              <p className="jp-hint">
                Upload a CV first so we can load jobs associated with its{" "}
                <code>cv_id</code>.
              </p>
            )}

            <div className="jp-actions">
              <button
                className="jp-button jp-button-primary"
                onClick={loadTrackedJobs}
                disabled={!cvInfo || jobsLoading}
              >
                {jobsLoading ? "Loading..." : "Load tracked jobs"}
              </button>
            </div>

            {trackedJobs.length === 0 && cvInfo && !jobsLoading && (
              <p className="jp-hint" style={{ marginTop: 10 }}>
                No tracked jobs yet for this CV. Run a match to create one.
              </p>
            )}

            {trackedJobs.length > 0 && (
              <div className="jp-match-result" style={{ marginTop: 16 }}>
                <table className="jobs-table">
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Company</th>
                      <th>Match %</th>
                      <th>Semantic</th>
                      <th>Overlap</th>
                      <th>Missing Skills</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trackedJobs.map((job, index) => (
                      <tr key={index}>
                        <td>{job.job_title}</td>
                        <td>{job.company}</td>
                        <td>{job.match_score.toFixed(1)}</td>
                        <td>{job.semantic_score.toFixed(3)}</td>
                        <td>{job.overlapping_skills.join(", ") || "None"}</td>
                        <td>{job.missing_skills.join(", ") || "None"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* ===== 4. COVER LETTER SECTION ===== */}
        <section className="jp-section">
          <div className="jp-section-header">
            <span className="jp-section-step">4</span>
            <div>
              <div className="jp-section-title">Generate cover letter</div>
              <div className="jp-section-subtitle">
                Use your CV and the job description to generate a tailored cover letter.
              </div>
            </div>
          </div>

          <div className="jp-card">
            {!cvInfo && (
              <p className="jp-hint">
                Upload a CV first so we can use its <code>cv_id</code> for the cover letter.
              </p>
            )}

            <div className="jp-form-grid jp-form-grid--two-col">
              <div className="jp-form-row">
                <label className="jp-label">Tone</label>
                <select
                  className="jp-input"
                  value={tone}
                  onChange={(e) =>
                    setTone(e.target.value as "professional" | "friendly" | "confident")
                  }
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="confident">Confident</option>
                </select>
                <span className="jp-hint">
                  Choose how you want the letter to sound.
                </span>
              </div>
            </div>

            <div className="jp-actions" style={{ marginTop: 14 }}>
              <button
                className="jp-button jp-button-primary"
                onClick={handleGenerateCoverLetter}
                disabled={!cvInfo || coverLoading}
              >
                {coverLoading ? "Generating…" : "Generate cover letter"}
              </button>
            </div>

            {coverLetter && (
              <div className="jp-match-result" style={{ marginTop: 16 }}>
                <span className="jp-meta-label">Generated cover letter</span>
                <textarea
                  className="jp-textarea"
                  style={{ marginTop: 8, minHeight: 220 }}
                  value={coverLetter}
                  readOnly
                />
                <div className="jp-actions" style={{ marginTop: 10 }}>
                  <button
                    className="jp-button jp-button-ghost"
                    type="button"
                    onClick={() => navigator.clipboard.writeText(coverLetter)}
                  >
                    Copy to clipboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
