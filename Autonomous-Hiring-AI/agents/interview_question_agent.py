from typing import Dict, List
import random


class InterviewQuestionAgent:
    """
    Generates targeted interview questions based on skill gaps
    """

    QUESTION_BANK = {
        "system design": {
            "intern": [
                "Explain how you would design a simple URL shortener.",
                "What are the basic components of a scalable web system?"
            ],
            "junior": [
                "Design a scalable file storage service.",
                "How would you handle load balancing in a web application?"
            ]
        },
        "deep learning": {
            "intern": [
                "What is backpropagation and why is it important?",
                "Explain the difference between CNNs and RNNs."
            ],
            "junior": [
                "How do you debug vanishing gradients?",
                "Explain transfer learning with an example."
            ]
        },
        "python": {
            "intern": [
                "Explain list vs tuple in Python.",
                "What are Python generators?"
            ],
            "junior": [
                "Explain Python memory management.",
                "What are decorators and where would you use them?"
            ]
        }
    }

    BEHAVIORAL_QUESTIONS = {
        "intern": [
            "Describe a time you had to learn a new technical skill quickly.",
            "Tell me about a project where things didn’t go as planned."
        ],
        "junior": [
            "Describe a technical decision you made under pressure.",
            "Tell me about a time you improved an existing system."
        ]
    }

    def generate_questions(
        self,
        missing_skills: List[str],
        role_level: str = "intern",
        max_questions_per_skill: int = 2
    ) -> Dict:
        technical_questions = []

        for skill in missing_skills:
            skill_key = skill.lower()

            if skill_key in self.QUESTION_BANK:
                questions = self.QUESTION_BANK[skill_key].get(role_level, [])
                selected = random.sample(
                    questions,
                    min(len(questions), max_questions_per_skill)
                )

                for q in selected:
                    technical_questions.append({
                        "skill": skill,
                        "question": q,
                        "difficulty": role_level
                    })

        behavioral_questions = random.sample(
            self.BEHAVIORAL_QUESTIONS.get(role_level, []),
            k=1
        )

        return {
            "technical_questions": technical_questions,
            "behavioral_questions": behavioral_questions,
            "coverage": list(set(missing_skills)),
            "difficulty": role_level
        }
