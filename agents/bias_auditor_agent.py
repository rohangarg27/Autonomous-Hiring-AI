import re
from typing import Dict, List
from copy import deepcopy


class BiasAuditorAgent:
    """
    Audits potential bias by masking sensitive or bias-prone signals
    and comparing score deltas.
    """

    PRESTIGE_TERMS = [
        "iit", "nit", "mit", "stanford", "harvard",
        "google", "meta", "amazon", "microsoft"
    ]

    def __init__(self, drift_threshold: float = 0.08):
        """
        drift_threshold: max acceptable score change after masking
        """
        self.drift_threshold = drift_threshold

    # -----------------------------
    # Masking Logic
    # -----------------------------
    def mask_bias_signals(self, text: str) -> str:
        masked = text.lower()

        for term in self.PRESTIGE_TERMS:
            masked = re.sub(rf"\b{term}\b", "[masked]", masked)

        return masked

    # -----------------------------
    # Bias Audit
    # -----------------------------
    def audit(
        self,
        original_score: float,
        resume_text: str,
        rescored_fn
    ) -> Dict:
        """
        rescored_fn: function that takes resume_text and returns new score
        """

        masked_resume = self.mask_bias_signals(resume_text)
        masked_score = rescored_fn(masked_resume)

        score_delta = abs(original_score - masked_score)

        bias_flag = score_delta > self.drift_threshold

        return {
            "bias_detected": bias_flag,
            "score_delta": round(score_delta, 3),
            "original_score": round(original_score, 3),
            "masked_score": round(masked_score, 3),
            "recommendation": (
                "manual_review_required" if bias_flag else "no_action_needed"
            )
        }
