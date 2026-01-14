// frontend/src/api/endpoints.ts
import { api } from "./client";
import type {
  CvUploadResponse,
  JobMatchResponse,
  TrackedJob,
  CoverLetterResponse,
} from "../types";

export async function uploadCv(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post<CvUploadResponse>("/upload_cv", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}

export async function matchJob(payload: {
  cv_id: string;
  job_title: string;
  company: string;
  job_description: string;
}) {
  const res = await api.post<JobMatchResponse>("/jobs/match", payload);
  return res.data;
}

export async function loadTrackedJobs(cv_id: string) {
  const res = await api.get<TrackedJob[]>("/jobs", { params: { cv_id } });
  return res.data;
}

export async function generateCoverLetter(payload: {
  cv_id: string;
  job_id: string;
  job_title: string;
  company: string;
  job_description: string;
  tone: string;
}) {
  const res = await api.post<CoverLetterResponse>("/cover-letter/generate", payload);
  return res.data;
}

export async function getLatestCoverLetter(jobId: string) {
  const res = await api.get<CoverLetterResponse>(`/cover-letter/latest/${jobId}`);
  return res.data;
}

// ✅ must be named exports
export const updateTrackedJob = (jobId: string, payload: { status?: string; notes?: string }) =>
  api.patch(`/jobs/${jobId}`, payload);

export const deleteTrackedJob = (jobId: string) =>
  api.delete(`/jobs/${jobId}`);

