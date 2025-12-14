type Props = {
  cvReady: boolean;
  tone: string;
  setTone: (v: string) => void;
  coverLoading: boolean;
  onGenerate: () => void;
  canGenerate: boolean; // ✅ new
  
};

export default function CoverLetterControls({
  cvReady,
  tone,
  setTone,
  coverLoading,
  onGenerate,
  canGenerate,
}: Props) {
  return (
    <section className="jp-section">
      <div className="jp-section-header">
        <span className="jp-section-step">3</span>
        <div>
          <div className="jp-section-title">Generate cover letter</div>
          <div className="jp-section-subtitle">Uses your CV + job description (OpenAI if enabled).</div>
        </div>
      </div>

      <div className="jp-card">
        {!cvReady && (
          <p className="jp-hint">
            Upload a CV first so we can use its <code>cv_id</code>.
          </p>
        )}

        <div className="jp-form-row" style={{ marginBottom: 12 }}>
          <label className="jp-label">Tone</label>
          <select className="jp-input" value={tone} onChange={(e) => setTone(e.target.value)}>
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="enthusiastic">Enthusiastic</option>
          </select>
          <span className="jp-hint">Choose how you want the letter to sound.</span>
        </div>

        <div className="jp-actions">
          <button
            className="jp-button jp-button-primary"
            onClick={onGenerate}
            disabled={!cvReady || coverLoading || !canGenerate} // ✅ here
          >
            {coverLoading ? "Generating…" : "Generate cover letter"}
          </button>
        </div>
      </div>
    </section>
  );
}
