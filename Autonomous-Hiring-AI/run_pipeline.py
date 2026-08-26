from pipeline import AutonomousHiringPipeline

resume_text = """
Skills: Python, Machine Learning, PyTorch
Experience: Built deep learning models for image classification and NLP tasks.
Education: B.Tech Computer Science
"""

job_description = """
We are hiring an ML intern with strong Python skills,
experience in deep learning, and basic system design knowledge.
"""

required_skills = ["Python", "Deep Learning", "System Design"]

pipeline = AutonomousHiringPipeline(role_level="intern")

result = pipeline.run(
    resume_text=resume_text,
    job_description=job_description,
    required_skills=required_skills
)

from pprint import pprint
pprint(result)
