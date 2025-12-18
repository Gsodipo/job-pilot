import type { JobMatchResponse } from "../types";

type Props = {
  matchResult: JobMatchResponse | null;
};

const safeNum = (v: unknown, fallback = 0) =>
  typeof v === "number" && Number.isFinite(v) ? v : fallback;

const safeArr = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];

export default function MatchResultCard({ matchResult }: Props) {
  if (!matchResult) return null;

  const matchScore = safeNum((matchResult as any).match_score);
  const semanticScore = safeNum((matchResult as any).semantic_score);
  const skillScore = safeNum((matchResult as any).skill_score);

  const jobSkills = safeArr((matchResult as any).job_skills);
  const overlap = safeArr((matchResult as any).overlapping_skills);
  const missing = safeArr((matchResult as any).missing_skills);

  return (
    <section id="match-result" className="jp-section">
      <div className="jp-section-header">
        <span className="jp-section-step">Result</span>
        <div>
          <div className="jp-section-title">Match result</div>
          <div className="jp-section-subtitle">
            Scores + overlapping and missing skills.
          </div>
        </div>
      </div>

      <div className="jp-card">
        <div className="jp-match-metrics">
          <div className="jp-metric">
            <span className="jp-metric-label">Match score</span>
            <span className="jp-metric-value">{matchScore.toFixed(1)}</span>
          </div>
          <div className="jp-metric">
            <span className="jp-metric-label">Semantic</span>
            <span className="jp-metric-value">{semanticScore.toFixed(3)}</span>
          </div>
          <div className="jp-metric">
            <span className="jp-metric-label">Skill</span>
            <span className="jp-metric-value">{skillScore.toFixed(3)}</span>
          </div>
        </div>

        <div className="jp-match-details">
          <div>
            <span className="jp-meta-label">Job skills</span>
            <div className="jp-skill-chips">
              {jobSkills.length > 0 ? (
                jobSkills.map((s) => (
                  <span key={s} className="jp-chip jp-chip-muted">
                    {s}
                  </span>
                ))
              ) : (
                <span className="jp-hint">No job skills found</span>
              )}
            </div>
          </div>

          <div>
            <span className="jp-meta-label">Overlap</span>
            <div className="jp-skill-chips">
              {overlap.length > 0 ? (
                overlap.map((s) => (
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
              {missing.length > 0 ? (
                missing.map((s) => (
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
    </section>
  );
}
