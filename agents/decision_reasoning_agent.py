from typing import Dict, List


class DecisionReasoningAgent:
    """
    Makes final hiring decisions with explainable reasoning
    """

    def __init__(self):
        self.thresholds = {
            "intern": {
                "advance": 0.50,
                "reject": 0.35
            },
            "junior": {
                "advance": 0.60,
                "reject": 0.45
            }
        }

    def decide(
        self,
        resume_result: Dict,
        interview_plan: Dict,
        bias_report: Dict,
        role_level: str = "intern"
    ) -> Dict:

        score = resume_result["overall_score"]
        missing_skills = resume_result["missing_skills"]
        bias_detected = bias_report["bias_detected"]

        reasons = []
        flags = []

        # --- Bias override ---
        if bias_detected:
            flags.append("bias_risk_detected")
            reasons.append(
                "Score instability detected after masking bias-prone signals."
            )

        # --- Decision logic ---
        advance_threshold = self.thresholds[role_level]["advance"]
        reject_threshold = self.thresholds[role_level]["reject"]
        if score >= advance_threshold and not bias_detected:
            decision = "advance_to_interview"
            reasons.append(
                f"Candidate meets skill threshold with score {score}."
            )
        elif score < reject_threshold:
            decision = "reject"
            reasons.append(
                f"Overall score {score} below minimum threshold."
            )
        else:
            decision = "manual_review"
            reasons.append(
                "Candidate shows partial fit requiring human evaluation."
            )

        # --- Skill gap reasoning ---
        if missing_skills:
            reasons.append(
                f"Identified skill gaps: {', '.join(missing_skills)}."
            )

        # --- Interview readiness ---
        if interview_plan["technical_questions"]:
            reasons.append(
                "Targeted interview questions generated to evaluate gaps."
            )

        # --- Confidence estimation ---
        confidence = min(score + (0.1 if decision == "advance_to_interview" else 0.0), 1.0)

        return {
            "final_decision": decision,
            "confidence": round(confidence, 3),
            "reasons": reasons,
            "flags": flags,
            "role_level": role_level
        }
