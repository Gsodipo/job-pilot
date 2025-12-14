type Props = {
  coverLetter: string;
};

export default function CoverLetterOutputCard({ coverLetter }: Props) {
  return (
    <section className="jp-section">
      <div className="jp-section-header">
        <span className="jp-section-step">Letter</span>
        <div>
          <div className="jp-section-title">Generated cover letter</div>
          <div className="jp-section-subtitle">Copy and tweak before submitting.</div>
        </div>
      </div>

      <div className="jp-card">
        <textarea
          className="jp-textarea"
          rows={18}
          value={coverLetter}
          readOnly
          placeholder="Your cover letter will appear here…"
        />

        {coverLetter && (
          <div className="jp-actions">
            <button
              className="jp-button jp-button-ghost"
              type="button"
              onClick={() => navigator.clipboard.writeText(coverLetter)}
            >
              Copy to clipboard
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
