from agents.resume_screening_agent import ResumeScreeningAgent
from agents.interview_question_agent import InterviewQuestionAgent
from agents.bias_auditor_agent import BiasAuditorAgent
from agents.decision_reasoning_agent import DecisionReasoningAgent


class AutonomousHiringPipeline:
    def __init__(self, role_level: str = "intern"):
        self.role_level = role_level

        self.resume_agent = ResumeScreeningAgent()
        self.interview_agent = InterviewQuestionAgent()
        self.bias_agent = BiasAuditorAgent()
        self.decision_agent = DecisionReasoningAgent()

    def run(
        self,
        resume_text: str,
        job_description: str,
        required_skills: list
    ) -> dict:

        # --- Agent 1: Resume Screening ---
        resume_result = self.resume_agent.score_resume(
            resume_text=resume_text,
            job_description=job_description,
            required_skills=required_skills,
            role_level=self.role_level
        )

        # --- Agent 2: Interview Question Generation ---
        interview_plan = self.interview_agent.generate_questions(
            missing_skills=resume_result["missing_skills"],
            role_level=self.role_level
        )

        # --- Agent 3: Bias Audit ---
        bias_report = self.bias_agent.audit(
            original_score=resume_result["overall_score"],
            resume_text=resume_text,
            rescored_fn=lambda text: self.resume_agent.score_resume(
                resume_text=text,
                job_description=job_description,
                required_skills=required_skills,
                role_level=self.role_level
            )["overall_score"]
        )

        # --- Agent 4: Final Decision ---
        final_decision = self.decision_agent.decide(
            resume_result=resume_result,
            interview_plan=interview_plan,
            bias_report=bias_report,
            role_level=self.role_level
        )

        return {
            "resume_screening": resume_result,
            "interview_plan": interview_plan,
            "bias_audit": bias_report,
            "final_decision": final_decision
        }
