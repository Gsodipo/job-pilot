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

export async function loadHistory(cv_id: string) {
  const res = await api.get<TrackedJob[]>(`/jobs/history/${cv_id}`);
  return res.data;
}

export async function generateCoverLetter(payload: {
  cv_id: string;
  job_title: string;
  company: string;
  job_description: string;
  tone: string;
}) {
  const res = await api.post<CoverLetterResponse>("/cover-letter/generate", payload);
  return res.data;
}
