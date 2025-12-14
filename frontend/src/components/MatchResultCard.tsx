import type { JobMatchResponse } from "../types";

type Props = {
  matchResult: JobMatchResponse | null;
};

export default function MatchResultCard({ matchResult }: Props) {
  if (!matchResult) return null;

  return (
    <section id="match-result" className="jp-section">
      <div className="jp-section-header">
        <span className="jp-section-step">Result</span>
        <div>
          <div className="jp-section-title">Match result</div>
          <div className="jp-section-subtitle">Scores + overlapping and missing skills.</div>
        </div>
      </div>

      <div className="jp-card">
        <div className="jp-match-metrics">
          <div className="jp-metric">
            <span className="jp-metric-label">Match score</span>
            <span className="jp-metric-value">{matchResult.match_score.toFixed(1)}</span>
          </div>
          <div className="jp-metric">
            <span className="jp-metric-label">Semantic</span>
            <span className="jp-metric-value">{matchResult.semantic_score.toFixed(3)}</span>
          </div>
          <div className="jp-metric">
            <span className="jp-metric-label">Skill</span>
            <span className="jp-metric-value">{matchResult.skill_score.toFixed(3)}</span>
          </div>
        </div>

        <div className="jp-match-details">
          <div>
            <span className="jp-meta-label">Job skills</span>
            <div className="jp-skill-chips">
              {matchResult.job_skills.map((s) => (
                <span key={s} className="jp-chip jp-chip-muted">{s}</span>
              ))}
            </div>
          </div>

          <div>
            <span className="jp-meta-label">Overlap</span>
            <div className="jp-skill-chips">
              {matchResult.overlapping_skills.length > 0
                ? matchResult.overlapping_skills.map((s) => (
                    <span key={s} className="jp-chip jp-chip-good">{s}</span>
                  ))
                : <span className="jp-hint">No overlapping skills</span>}
            </div>
          </div>

          <div>
            <span className="jp-meta-label">Missing</span>
            <div className="jp-skill-chips">
              {matchResult.missing_skills.length > 0
                ? matchResult.missing_skills.map((s) => (
                    <span key={s} className="jp-chip jp-chip-bad">{s}</span>
                  ))
                : <span className="jp-hint">No missing skills 🎉</span>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
