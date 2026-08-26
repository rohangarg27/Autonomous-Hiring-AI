import styles from './BiasReport.module.css'

export default function BiasReport({ biasAudit }) {
  const { bias_detected, score_delta, original_score, masked_score, recommendation } = biasAudit
  const deltaPercent = Math.round(score_delta * 100)

  return (
    <div className={`card ${styles.biasCard}`} id="bias-report-section">
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={`${styles.icon} ${bias_detected ? styles.iconDanger : styles.iconSuccess}`}>
            {bias_detected ? '⚠️' : '✅'}
          </div>
          <div>
            <h3 className={styles.title}>Bias Audit</h3>
            <p className={styles.subtitle}>Counterfactual masking analysis</p>
          </div>
        </div>
        <span className={`tag ${bias_detected ? 'tag-danger' : 'tag-success'}`}>
          {bias_detected ? 'Bias Detected' : 'No Bias Found'}
        </span>
      </div>

      <div className={styles.metricsRow}>
        <div className={styles.metric}>
          <p className={styles.metricLabel}>Original Score</p>
          <p className={styles.metricValue} style={{ color: 'var(--clr-accent)' }}>
            {Math.round(original_score * 100)}%
          </p>
        </div>
        <div className={styles.arrowDivider}>→</div>
        <div className={styles.metric}>
          <p className={styles.metricLabel}>Masked Score</p>
          <p className={styles.metricValue} style={{ color: bias_detected ? 'var(--clr-danger)' : 'var(--clr-success)' }}>
            {Math.round(masked_score * 100)}%
          </p>
        </div>
        <div className={styles.metric}>
          <p className={styles.metricLabel}>Score Delta</p>
          <p className={styles.metricValue} style={{ color: bias_detected ? 'var(--clr-warning)' : 'var(--clr-text-secondary)' }}>
            {deltaPercent > 0 ? '+' : ''}{deltaPercent}%
          </p>
        </div>
      </div>

      {/* Delta bar */}
      <div className={styles.deltaSection}>
        <p className={styles.deltaLabel}>Score Drift (threshold: 8%)</p>
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{
              width: `${Math.min(deltaPercent * 3, 100)}%`,
              background: bias_detected
                ? 'linear-gradient(90deg, var(--clr-warning), var(--clr-danger))'
                : 'linear-gradient(90deg, var(--clr-success), var(--clr-accent))',
            }}
          />
        </div>
        <div className={styles.thresholdMarker} style={{ left: `${Math.min(8 * 3, 100)}%` }}>
          <span className={styles.thresholdLabel}>8%</span>
        </div>
      </div>

      <div className={`${styles.recommendation} ${bias_detected ? styles.recommendDanger : styles.recommendSuccess}`}>
        <span className={styles.recIcon}>{bias_detected ? '🔍' : '✔'}</span>
        <p>
          <strong>Recommendation: </strong>
          {recommendation === 'manual_review_required'
            ? 'Manual review required — score instability detected after masking prestige signals (IIT, Google, etc.)'
            : 'No action needed — score remains stable after masking bias-prone signals.'}
        </p>
      </div>
    </div>
  )
}
