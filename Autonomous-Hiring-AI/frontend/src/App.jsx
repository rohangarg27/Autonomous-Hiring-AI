import { useState } from 'react'
import InputForm from './components/InputForm'
import ResultsDashboard from './components/ResultsDashboard'
import { evaluateCandidate } from './api/hiring'
import styles from './App.module.css'

export default function App() {
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleEvaluate(formData) {
    setIsLoading(true)
    setError(null)
    setResults(null)
    try {
      const data = await evaluateCandidate(formData)
      setResults(data)
      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById('results-dashboard')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Something went wrong. Is the backend running?'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  function handleReset() {
    setResults(null)
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={styles.app}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.logoRow}>
          <div className={styles.logoDot} />
          <span className={styles.logoText}>HireAI</span>
          <span className={styles.logoBadge}>Beta</span>
        </div>
        <nav className={styles.nav}>
          <a href="#evaluation-form" className={styles.navLink}>Evaluate</a>
          <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" className={styles.navLink}>
            API Docs ↗
          </a>
        </nav>
      </header>

      <main className={styles.main}>
        {/* ── Hero ── */}
        <section className={styles.hero}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Multi-Agent AI System
          </div>
          <h1 className={styles.heroTitle}>
            Autonomous
            <br />
            <span className={styles.heroAccent}>Hiring Intelligence</span>
          </h1>
          <p className={styles.heroDesc}>
            4 AI agents working in sequence — resume screening, interview generation,
            bias auditing, and explainable hiring decisions.
          </p>

          {/* Agent pipeline visualization */}
          <div className={styles.agentPipeline}>
            {[
              { icon: '📄', label: 'Resume Screening', sub: 'Semantic embeddings' },
              { icon: '❓', label: 'Interview Gen', sub: 'Skill gap questions' },
              { icon: '⚖️', label: 'Bias Audit', sub: 'Counterfactual masking' },
              { icon: '🎯', label: 'Final Decision', sub: 'Explainable AI' },
            ].map((agent, idx) => (
              <div key={idx} className={styles.agentStep}>
                <div className={styles.agentCard}>
                  <div className={styles.agentIcon}>{agent.icon}</div>
                  <div>
                    <p className={styles.agentLabel}>{agent.label}</p>
                    <p className={styles.agentSub}>{agent.sub}</p>
                  </div>
                </div>
                {idx < 3 && <div className={styles.agentArrow}>→</div>}
              </div>
            ))}
          </div>
        </section>

        {/* ── Main Content ── */}
        <div className={styles.content}>
          {/* Input Form Column */}
          {!results && (
            <section className={`card ${styles.formCard}`}>
              <InputForm onSubmit={handleEvaluate} isLoading={isLoading} />
            </section>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className={styles.loadingState}>
              <div className={styles.loadingSpinner} />
              <h3 className={styles.loadingTitle}>Running AI Agents...</h3>
              <p className={styles.loadingDesc}>
                The ML model may take 30–60s on first run while loading sentence transformers.
              </p>
              <div className={styles.agentProgress}>
                {['Resume Screening', 'Interview Generation', 'Bias Audit', 'Decision Reasoning'].map((agent, idx) => (
                  <div key={idx} className={styles.agentProgressItem} style={{ animationDelay: `${idx * 0.5}s` }}>
                    <div className={styles.agentProgressDot} />
                    <span>{agent}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className={`card ${styles.errorCard}`} id="error-message">
              <span className={styles.errorIcon}>⚠️</span>
              <div>
                <h4 className={styles.errorTitle}>Evaluation Failed</h4>
                <p className={styles.errorMsg}>{error}</p>
                <p className={styles.errorHint}>
                  Make sure the backend is running: <code>uvicorn backend.main:app --reload</code>
                </p>
              </div>
            </div>
          )}

          {/* Results */}
          {results && !isLoading && (
            <ResultsDashboard results={results} onReset={handleReset} />
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Autonomous Hiring AI · Built with FastAPI + React</p>
        <p className={styles.footerSub}>
          4 AI agents · Bias-aware · Explainable decisions
        </p>
      </footer>
    </div>
  )
}
