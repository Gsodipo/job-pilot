from typing import List, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class JobMatcherService:
    def __init__(self):
        # You can reuse a single vectorizer instance
        self.vectorizer = TfidfVectorizer(stop_words="english")

    def compute_semantic_score(self, cv_text: str, job_text: str) -> float:
        """
        Returns a semantic similarity score between 0 and 1.
        """
        documents = [cv_text, job_text]

        tfidf_matrix = self.vectorizer.fit_transform(documents)
        similarity_matrix = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
        score = float(similarity_matrix[0][0])

        return score

    def compute_skill_overlap(
        self,
        cv_skills: List[str],
        job_skills: List[str],
    ) -> Dict[str, Any]:
        """
        Compute overlap between CV skills and job skills.

        Returns:
            {
                "overlapping_skills": [...],
                "missing_skills": [...],
                "skill_score": 0.0–1.0
            }
        """
        # Normalize skills: lowercase + strip whitespace
        cv_set = {
            skill.strip().lower()
            for skill in cv_skills
            if skill and skill.strip()
        }
        job_set = {
            skill.strip().lower()
            for skill in job_skills
            if skill and skill.strip()
        }

        # If the job has no skills detected, we can't compute a meaningful score
        if not job_set:
            return {
                "overlapping_skills": [],
                "missing_skills": [],
                "skill_score": 0.0,
            }

        overlapping = cv_set.intersection(job_set)
        missing = job_set.difference(cv_set)

        skill_score = len(overlapping) / len(job_set)

        return {
            "overlapping_skills": sorted(list(overlapping)),
            "missing_skills": sorted(list(missing)),
            "skill_score": skill_score,
        }


    def compute_match_result(
        self,
        cv_id: str,
        cv_text: str,
        cv_skills: List[str],
        job_title: Optional[str],
        company: Optional[str],
        job_description: str,
        job_skills: List[str],
    ) -> Dict[str, Any]:
        """
        Combine semantic similarity and skill overlap into a final match score.
        - semantic_score: 0–1 (TF-IDF cosine similarity)
        - skill_score:    0–1 (overlap of skills)
        - match_score:    0–100 (weighted combination)
        """
        # 1. Semantic similarity between CV text and job description
        semantic_score = self.compute_semantic_score(cv_text, job_description)

        # 2. Skill overlap
        overlap_result = self.compute_skill_overlap(cv_skills, job_skills)
        skill_score = overlap_result["skill_score"]
        overlapping_skills = overlap_result["overlapping_skills"]
        missing_skills = overlap_result["missing_skills"]

        # 3. Weighted combination
        weight_semantic = 0.7
        weight_skills = 0.3

        raw_score = weight_semantic * semantic_score + weight_skills * skill_score
        match_score = raw_score * 100.0

        # 4. Optional rounding for nicer output
        semantic_score = round(semantic_score, 3)
        skill_score = round(skill_score, 3)
        match_score = round(match_score, 1)

        return {
            "cv_id": cv_id,
            "job_title": job_title,
            "company": company,
            "match_score": match_score,
            "semantic_score": semantic_score,
            "skill_score": skill_score,
            "job_skills": job_skills,
            "overlapping_skills": overlapping_skills,
            "missing_skills": missing_skills,
        }

