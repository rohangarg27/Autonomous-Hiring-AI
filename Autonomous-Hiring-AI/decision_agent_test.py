from agents.decision_reasoning_agent import DecisionReasoningAgent

resume_result = {
    "overall_score": 0.597,
    "missing_skills": ["System Design"]
}

interview_plan = {
    "technical_questions": [
        {"skill": "System Design", "question": "Design a URL shortener."}
    ]
}

bias_report = {
    "bias_detected": False
}

agent = DecisionReasoningAgent()
decision = agent.decide(
    resume_result=resume_result,
    interview_plan=interview_plan,
    bias_report=bias_report,
    role_level="intern"
)

print(decision)
