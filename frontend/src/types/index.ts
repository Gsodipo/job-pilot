export interface CvUploadResponse {
  cv_id: string;
  file_name: string;
  skills: string[];
  experience: string[];
}

export interface JobMatchResponse {
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
  job_description: string;

  match_score: number;
  semantic_score: number;
  skill_score: number;

  job_skills: string[];
  overlapping_skills: string[];
  missing_skills: string[];
}


export interface CoverLetterResponse {
  cover_letter: string;
  mode: "openai" | "template";
  note?: string;
}
