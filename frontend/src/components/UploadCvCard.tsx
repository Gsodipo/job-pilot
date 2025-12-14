import type { CvUploadResponse } from "../types";

type Props = {
  cvFile: File | null;
  setCvFile: (f: File | null) => void;
  cvInfo: CvUploadResponse | null;
  loading: boolean;
  onUpload: () => void;
};

export default function UploadCvCard({
  cvFile,
  setCvFile,
  cvInfo,
  loading,
  onUpload,
}: Props) {
  return (
    <section className="jp-section">
      <div className="jp-section-header">
        <span className="jp-section-step">1</span>
        <div>
          <div className="jp-section-title">Upload your CV</div>
          <div className="jp-section-subtitle">
            Upload a PDF CV. JobPilot will parse it into skills and experience.
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
              <span className="jp-hint">Drag &amp; drop your CV here, or click to browse.</span>

              {cvFile && (
                <span className="jp-upload-selected">
                  Selected: <strong>{cvFile.name}</strong>
                </span>
              )}
            </div>

            <div className="jp-actions">
              <button
                className="jp-button jp-button-primary"
                onClick={onUpload}
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
                    <span key={s} className="jp-chip">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
