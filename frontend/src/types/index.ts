export interface CvUploadResponse {
  cv_id: string;
  file_name: string;
  skills: string[];
  experience: string[];
}

export interface JobMatchResponse {
  match_id?: string;
  tracked_job_id?: string;

  cv_id: string;
  job_title: string;
  company: string;
  match_score: number;
  semantic_score: number;
  skill_score: number;
  job_skills: string[];
  overlapping_skills: string[];
  missing_skills: string[];
}


export interface TrackedJob {
  id: string;
  cv_id: string;
  job_title: string;
  company: string;
  job_description?: string;
  status?: string;
  notes?: string;
  job_match_id?: string;
  
  // ✅ ADD
  job_url?: string;
  source?: string;
}




export interface CoverLetterResponse {
  cover_letter: string;
  mode: "openai" | "template" | "none"; // ✅ add none
  note?: string;
}

export type CoverLetterHistoryItem = {
  id?: string;        // if your backend returns "id"
  _id?: string;       // if your backend returns Mongo _id
  job_id: string;
  cv_id: string;

  tone: string;
  mode: "openai" | "template" | "none";
  note?: string | null;

  text?: string;              // if backend stores as "text"
  cover_letter?: string;      // if backend returns as "cover_letter"

  created_at: string; // ISO string
};

