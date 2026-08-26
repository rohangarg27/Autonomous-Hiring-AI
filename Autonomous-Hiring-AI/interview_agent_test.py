from agents.interview_question_agent import InterviewQuestionAgent

missing_skills = ["System Design"]
role_level = "intern"

agent = InterviewQuestionAgent()
result = agent.generate_questions(
    missing_skills=missing_skills,
    role_level=role_level
)

print(result)
