type Props = {
  cvReady: boolean;
  jobTitle: string;
  setJobTitle: (v: string) => void;
  company: string;
  setCompany: (v: string) => void;
  jobDescription: string;
  setJobDescription: (v: string) => void;
  loading: boolean;
  onMatch: () => void;
};

export default function JobMatchCard({
  cvReady,
  jobTitle,
  setJobTitle,
  company,
  setCompany,
  jobDescription,
  setJobDescription,
  loading,
  onMatch,
}: Props) {
  return (
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
        {!cvReady && (
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
              placeholder="e.g. Fund Recs"
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
            onClick={onMatch}
            disabled={!cvReady || loading}
          >
            Run match
          </button>
        </div>
      </div>
    </section>
  );
}
