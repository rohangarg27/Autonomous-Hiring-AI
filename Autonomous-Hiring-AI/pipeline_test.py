from agents.resume_screening_agent import ResumeScreeningAgent

resume_text = """
Skills: Python, Machine Learning, PyTorch, Data Analysis
Experience: Built ML models for image classification and NLP tasks.
Education: B.Tech Computer Science
"""

job_description = """
Looking for an ML intern with strong Python skills,
experience in deep learning, PyTorch, and basic system design.
"""

required_skills = ["Python", "PyTorch", "Deep Learning", "System Design"]

agent = ResumeScreeningAgent()
result = agent.score_resume(resume_text, job_description, required_skills)

print(result)
