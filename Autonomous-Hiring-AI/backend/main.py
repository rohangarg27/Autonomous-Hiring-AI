import sys
import os

# Add parent directory to path so agents and pipeline are importable
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.models import EvaluationRequest, EvaluationResponse
from pipeline import AutonomousHiringPipeline

app = FastAPI(
    title="Autonomous Hiring AI API",
    description="Multi-agent AI system for resume screening, interview generation, bias auditing, and hiring decisions.",
    version="1.0.0",
)

# Allow the Vite dev server to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok", "message": "Autonomous Hiring AI API is running"}


@app.post("/api/evaluate", response_model=EvaluationResponse)
def evaluate_candidate(request: EvaluationRequest):
    """
    Run the full autonomous hiring pipeline on a candidate's resume.

    - **resume_text**: Full text of the candidate's resume
    - **job_description**: Job description
    - **required_skills**: List of required skills
    - **role_level**: 'intern', 'junior', or 'senior'
    """
    try:
        pipeline = AutonomousHiringPipeline(role_level=request.role_level)
        result = pipeline.run(
            resume_text=request.resume_text,
            job_description=request.job_description,
            required_skills=request.required_skills,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline error: {str(e)}")
