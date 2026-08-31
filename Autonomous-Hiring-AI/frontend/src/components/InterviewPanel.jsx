import { useState } from 'react'
import styles from './InterviewPanel.module.css'

export default function InterviewPanel({ interviewPlan }) {
  const [activeTab, setActiveTab] = useState('technical')
  const { technical_questions, behavioral_questions, coverage, difficulty } = interviewPlan

  return (
    <div className={`card ${styles.panel}`} id="interview-questions-section">
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Interview Questions</h3>
          <p className={styles.subtitle}>Targeted questions based on skill gaps</p>
        </div>
        <div className={styles.meta}>
          <span className="tag tag-purple">{difficulty}</span>
          {coverage.length > 0 && (
            <span className="tag tag-accent">{coverage.length} skill{coverage.length !== 1 ? 's' : ''} covered</span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          id="tab-technical"
          className={`${styles.tab} ${activeTab === 'technical' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('technical')}
        >
          🔧 Technical
          <span className={styles.tabCount}>{technical_questions.length}</span>
        </button>
        <button
          id="tab-behavioral"
          className={`${styles.tab} ${activeTab === 'behavioral' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('behavioral')}
        >
          💬 Behavioral
          <span className={styles.tabCount}>{behavioral_questions.length}</span>
        </button>
      </div>

      {/* Technical Questions */}
      {activeTab === 'technical' && (
        <div className={styles.questionList} id="technical-questions-list">
          {technical_questions.length === 0 ? (
            <div className={styles.emptyState}>
              <span>🎯</span>
              <p>No targeted technical questions — candidate meets all required skills!</p>
            </div>
          ) : (
            technical_questions.map((q, idx) => (
              <div key={idx} className={styles.questionItem} style={{ animationDelay: `${idx * 0.08}s` }}>
                <div className={styles.questionNumber}>{String(idx + 1).padStart(2, '0')}</div>
                <div className={styles.questionContent}>
                  <p className={styles.questionText}>{q.question}</p>
                  <div className={styles.questionMeta}>
                    <span className="tag tag-accent">{q.skill}</span>
                    <span className="tag tag-purple">{q.difficulty}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Behavioral Questions */}
      {activeTab === 'behavioral' && (
        <div className={styles.questionList} id="behavioral-questions-list">
          {behavioral_questions.map((q, idx) => (
            <div key={idx} className={styles.questionItem} style={{ animationDelay: `${idx * 0.08}s` }}>
              <div className={styles.questionNumber} style={{ background: 'var(--clr-purple-dim)', color: '#a78bfa' }}>
                {String(idx + 1).padStart(2, '0')}
              </div>
              <div className={styles.questionContent}>
                <p className={styles.questionText}>{q}</p>
                <div className={styles.questionMeta}>
                  <span className="tag tag-purple">Behavioral</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
