import type { TrackedJob } from "../types";
import { updateTrackedJob, deleteTrackedJob } from "../api/endpoints";

type Props = {
  cvReady: boolean;
  jobsLoading: boolean;
  trackedJobs: TrackedJob[];
  onLoad: () => void;
  onView: (job: TrackedJob) => void;
};

const STATUS_OPTIONS = [
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

export default function TrackedJobsCard({
  cvReady,
  jobsLoading,
  trackedJobs,
  onLoad,
  onView,
}: Props) {
  const handleStatusChange = async (jobId: string, status: string) => {
    await updateTrackedJob(jobId, { status });
    await onLoad();
  };

  const handleDelete = async (jobId: string) => {
    const ok = window.confirm("Delete this tracked job?");
    if (!ok) return;

    await deleteTrackedJob(jobId);
    await onLoad();
  };

  return (
    <section className="jp-section">
      <div className="jp-section-header">
        <span className="jp-section-step">History</span>
        <div>
          <div className="jp-section-title">Tracked jobs</div>
          <div className="jp-section-subtitle">Jobs you’ve already matched for this CV.</div>
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
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {trackedJobs.map((job) => (
                    <tr key={job.id}>
                      <td>{job.job_title}</td>
                      <td>{job.company}</td>

                      <td>
                        <select
                          className="jp-input"
                          value={job.status?.trim() ? job.status : "saved"}
                          onChange={(e) => handleStatusChange(job.id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td style={{ display: "flex", gap: 8 }}>
                        <button
                          className="jp-button jp-button-ghost"
                          type="button"
                          onClick={() => onView(job)}
                        >
                          View
                        </button>

                        <button
                          className="jp-button jp-button-ghost"
                          type="button"
                          onClick={() => handleDelete(job.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {trackedJobs.length === 0 && cvReady && !jobsLoading && (
          <p className="jp-hint" style={{ marginTop: 10 }}>
            No tracked jobs yet. Run a match to create one.
          </p>
        )}
      </div>
    </section>
  );
}
