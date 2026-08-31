from agents.bias_auditor_agent import BiasAuditorAgent
from agents.resume_screening_agent import ResumeScreeningAgent

resume_text = """
Skills: Python, Machine Learning, PyTorch
Experience: Internship at Google working on NLP models.
Education: B.Tech from IIT Delhi
"""

job_description = """
Looking for an ML intern with Python and deep learning experience.
"""

required_skills = ["Python", "Deep Learning", "System Design"]

screening_agent = ResumeScreeningAgent()
bias_agent = BiasAuditorAgent()

original_result = screening_agent.score_resume(
    resume_text,
    job_description,
    required_skills,
    role_level="intern"
)

audit = bias_agent.audit(
    original_score=original_result["overall_score"],
    resume_text=resume_text,
    rescored_fn=lambda text: screening_agent.score_resume(
        text,
        job_description,
        required_skills,
        role_level="intern"
    )["overall_score"]
)

print(audit)
