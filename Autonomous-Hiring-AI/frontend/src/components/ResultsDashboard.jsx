import ScoreCard from './ScoreCard'
import BiasReport from './BiasReport'
import InterviewPanel from './InterviewPanel'
import DecisionBadge from './DecisionBadge'
import styles from './ResultsDashboard.module.css'

export default function ResultsDashboard({ results, onReset }) {
  const { resume_screening, interview_plan, bias_audit, final_decision } = results

  return (
    <div className={styles.dashboard} id="results-dashboard">
      {/* Dashboard header */}
      <div className={styles.dashHeader}>
        <div>
          <h2 className={styles.dashTitle}>Evaluation Results</h2>
          <p className={styles.dashSubtitle}>
            Analyzed by 4 autonomous AI agents
          </p>
        </div>
        <button className="btn btn-ghost" onClick={onReset} id="new-evaluation-btn">
          ← New Evaluation
        </button>
      </div>

      {/* Final Decision — hero */}
      <DecisionBadge finalDecision={final_decision} />

      {/* Resume Screening Card */}
      <div className={`card ${styles.screeningCard}`} id="resume-screening-section">
        <div className={styles.sectionHeader}>
          <div>
            <h3 className={styles.sectionTitle}>Resume Screening</h3>
            <p className={styles.sectionSubtitle}>Semantic embeddings · Skill gap analysis</p>
          </div>
          <span className="tag tag-accent">Agent 1</span>
        </div>

        <div className={styles.scoresRow}>
          <ScoreCard
            label="Skill Match"
            score={resume_screening.skill_match_score}
            color="auto"
            size={110}
          />
          <ScoreCard
            label="Experience Alignment"
            score={resume_screening.experience_alignment_score}
            color="auto"
            size={110}
          />
          <ScoreCard
            label="Overall Score"
            score={resume_screening.overall_score}
            color="var(--clr-accent)"
            size={110}
          />
        </div>

        {/* Missing Skills */}
        <div className={styles.divider} />
        <div>
          <p className={styles.missingSkillsLabel}>
            Missing Skills
            {resume_screening.missing_skills.length === 0 && (
              <span className="tag tag-success" style={{ marginLeft: 10 }}>All Skills Met ✓</span>
            )}
          </p>
          <div className={styles.skillTags}>
            {resume_screening.missing_skills.length === 0 ? (
              <p className={styles.noMissing}>No missing skills detected for this role level.</p>
            ) : (
              resume_screening.missing_skills.map(skill => (
                <span key={skill} className="tag tag-danger">{skill}</span>
              ))
            )}
          </div>
        </div>

        {/* Confidence */}
        <div>
          <div className={styles.confidenceRow}>
            <span className={styles.confidenceLabel}>Screening Confidence</span>
            <span className={styles.confidenceValue}>{Math.round(resume_screening.confidence * 100)}%</span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{
                width: `${Math.round(resume_screening.confidence * 100)}%`,
                background: 'linear-gradient(90deg, var(--clr-accent), #00b4d8)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Bias Report */}
      <BiasReport biasAudit={bias_audit} />

      {/* Interview Questions */}
      <InterviewPanel interviewPlan={interview_plan} />
    </div>
  )
}
