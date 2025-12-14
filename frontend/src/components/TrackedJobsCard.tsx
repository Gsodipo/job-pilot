import type { TrackedJob } from "../types";

type Props = {
  cvReady: boolean;
  jobsLoading: boolean;
  trackedJobs: TrackedJob[];
  onLoad: () => void;
  onView: (job: TrackedJob) => void; // ✅ NEW
};

export default function TrackedJobsCard({
  cvReady,
  jobsLoading,
  trackedJobs,
  onLoad,
  onView, // ✅ NEW
}: Props) {
  return (
    <section className="jp-section">
      <div className="jp-section-header">
        <span className="jp-section-step">History</span>
        <div>
          <div className="jp-section-title">Tracked jobs</div>
          <div className="jp-section-subtitle">
            Jobs you’ve already matched for this CV.
          </div>
        </div>
      </div>

      <div className="jp-card">
        <div className="jp-actions" style={{ marginTop: 0 }}>
          <button
            className="jp-button jp-button-primary"
            onClick={onLoad}
            disabled={!cvReady || jobsLoading}
          >
            {jobsLoading ? "Loading..." : "Load tracked jobs"}
          </button>
        </div>

        {trackedJobs.length > 0 && (
          <div className="jp-match-result" style={{ marginTop: 16 }}>
            <div className="jp-table-scroll">
              <table className="jobs-table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Match %</th>
                    <th>Semantic</th>
                    <th>Overlap</th>
                    <th>Missing</th>
                    <th></th> {/* ✅ actions column */}
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
                      <td>
                        <button
                          className="jp-button jp-button-ghost"
                          type="button"
                          onClick={() => onView(job)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
