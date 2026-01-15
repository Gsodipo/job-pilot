import type { CoverLetterHistoryItem } from "../types";

type Props = {
  coverLetter: string;
  history?: CoverLetterHistoryItem[];
  onSelectHistory?: (item: CoverLetterHistoryItem) => void;
};


export default function CoverLetterOutputCard({
  coverLetter,
  history = [],
  onSelectHistory,
}: Props) {
  return (
    <section className="jp-section">
      <div className="jp-section-header">
        <span className="jp-section-step">Letter</span>
        <div>
          <div className="jp-section-title">Generated cover letter</div>
          <div className="jp-section-subtitle">
            Copy and tweak before submitting.
          </div>
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

        {/* ✅ HISTORY SECTION */}
        <div style={{ marginTop: 20 }}>
          <div className="jp-section-subtitle">History</div>

          {history.length === 0 ? (
            <div className="jp-hint" style={{ marginTop: 8 }}>
              No previous versions yet.
            </div>
          ) : (
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
            {history.slice(0, 5).map((h, idx) => {
              const key = h.id ?? h._id ?? `${h.job_id}-${h.created_at}-${idx}`;
              const content = h.cover_letter ?? h.text ?? "";

              return (
                <button
                  key={key}
                  type="button"
                  className="jp-button jp-button-ghost"
                  style={{ textAlign: "left" }}
                  onClick={() => onSelectHistory?.({ ...h, cover_letter: content })}
                >
                  <strong>{h.tone}</strong>{" "}
                  <span className="jp-hint">
                    · {h.mode} · {new Date(h.created_at).toLocaleString()}
                  </span>
                </button>
              );
            })}

            </div>
          )}
        </div>
      </div>
    </section>
  );
}
