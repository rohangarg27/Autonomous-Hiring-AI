import re
import json
from typing import Dict, List
import numpy as np
from sentence_transformers import SentenceTransformer, util


class ResumeScreeningAgent:
    SKILL_SYNONYMS = {
    "deep learning": [
        "neural network",
        "cnn",
        "rnn",
        "transformer",
        "image classification",
        "nlp",
        "pytorch",
        "tensorflow"
    ],
    "machine learning": [
        "ml",
        "classification",
        "regression",
        "model training"
    ]
}

    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        """
        Resume Screening Agent
        Uses semantic embeddings to evaluate resume-job alignment
        """
        self.model = SentenceTransformer(model_name)

    # -----------------------------
    # Resume Parsing
    # -----------------------------
    def _clean_text(self, text: str) -> str:
        text = re.sub(r"\s+", " ", text)
        text = re.sub(r"[^a-zA-Z0-9.,() ]", "", text)
        return text.lower()

    def parse_resume(self, resume_text: str) -> Dict[str, str]:
        """
        Very lightweight resume parser (extendable)
        """
        resume_text = self._clean_text(resume_text)

        sections = {
            "skills": "",
            "experience": "",
            "education": ""
        }

        current_section = None
        for line in resume_text.split("."):
            if "skill" in line:
                current_section = "skills"
            elif "experience" in line:
                current_section = "experience"
            elif "education" in line:
                current_section = "education"

            if current_section:
                sections[current_section] += line + " "

        return sections

    # -----------------------------
    # Semantic Scoring
    # -----------------------------
    def compute_similarity(self, text_a: str, text_b: str) -> float:
        emb_a = self.model.encode(text_a, convert_to_tensor=True)
        emb_b = self.model.encode(text_b, convert_to_tensor=True)
        return float(util.cos_sim(emb_a, emb_b))

    def score_resume(
    self,
    resume_text: str,
    job_description: str,
    required_skills: List[str],
    role_level: str = "intern"
) -> Dict:

        parsed = self.parse_resume(resume_text)

        # Section similarity scores
        skill_score = self.compute_similarity(
            parsed["skills"], job_description
        )
        experience_score = self.compute_similarity(
            parsed["experience"], job_description
        )
        experience_score = max(experience_score, 0.15)


        # Skill gap detection
        resume_text_full = (
            parsed["skills"] + " " + parsed["experience"]
            ).lower()
        missing_skills = []
        for skill in required_skills:
            skill_lower = skill.lower()

    # Exact match
            if skill_lower in resume_text_full:
                continue

    # Synonym match
            synonyms = self.SKILL_SYNONYMS.get(skill_lower, [])
            if any(syn in resume_text_full for syn in synonyms):
                continue

    # Semantic fallback
            semantic_score = self.compute_similarity(resume_text_full, skill)
            if semantic_score < 0.45:
                missing_skills.append(skill)


        # Weighted final score
        final_score = (
    0.65 * skill_score +
    0.25 * experience_score +
    0.10 * (1 - len(missing_skills) / max(len(required_skills), 1))
)

        if role_level == "intern":
            calibrated_score = min(final_score * 1.25, 1.0)
        elif role_level == "junior":
            calibrated_score = min(final_score * 1.1, 1.0)
        else:
            calibrated_score = final_score

        return {
            "skill_match_score": round(skill_score, 3),
            "experience_alignment_score": round(experience_score, 3),
            "missing_skills": missing_skills,
            "overall_score": round(calibrated_score, 3),
"confidence": round(min(calibrated_score + 0.1, 1.0), 3)

        }
