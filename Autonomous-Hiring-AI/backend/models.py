from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


class EvaluationRequest(BaseModel):
    resume_text: str = Field(..., description="Full text of the candidate's resume")
    job_description: str = Field(..., description="Job description text")
    required_skills: List[str] = Field(..., description="List of required skills for the role")
    role_level: str = Field(default="intern", description="Role level: intern, junior, or senior")


class ResumeScreeningResult(BaseModel):
    skill_match_score: float
    experience_alignment_score: float
    missing_skills: List[str]
    overall_score: float
    confidence: float


class InterviewQuestion(BaseModel):
    skill: str
    question: str
    difficulty: str


class InterviewPlan(BaseModel):
    technical_questions: List[InterviewQuestion]
    behavioral_questions: List[str]
    coverage: List[str]
    difficulty: str


class BiasAudit(BaseModel):
    bias_detected: bool
    score_delta: float
    original_score: float
    masked_score: float
    recommendation: str


class FinalDecision(BaseModel):
    final_decision: str
    confidence: float
    reasons: List[str]
    flags: List[str]
    role_level: str


class EvaluationResponse(BaseModel):
    resume_screening: ResumeScreeningResult
    interview_plan: InterviewPlan
    bias_audit: BiasAudit
    final_decision: FinalDecision
