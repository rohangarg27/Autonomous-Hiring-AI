import styles from './DecisionBadge.module.css'

const DECISION_CONFIG = {
  advance_to_interview: {
    label: 'Advance to Interview',
    icon: '🚀',
    className: styles.advance,
    tagClass: 'tag-success',
    tagLabel: 'Approved',
    accentColor: 'var(--clr-success)',
    gradientFrom: 'rgba(16, 185, 129, 0.15)',
    gradientTo: 'transparent',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  reject: {
    label: 'Rejected',
    icon: '❌',
    className: styles.reject,
    tagClass: 'tag-danger',
    tagLabel: 'Rejected',
    accentColor: 'var(--clr-danger)',
    gradientFrom: 'rgba(239, 68, 68, 0.12)',
    gradientTo: 'transparent',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  manual_review: {
    label: 'Manual Review Required',
    icon: '🔍',
    className: styles.review,
    tagClass: 'tag-warning',
    tagLabel: 'Review',
    accentColor: 'var(--clr-warning)',
    gradientFrom: 'rgba(245, 158, 11, 0.12)',
    gradientTo: 'transparent',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
}

export default function DecisionBadge({ finalDecision }) {
  const { final_decision, confidence, reasons, flags, role_level } = finalDecision
  const config = DECISION_CONFIG[final_decision] || DECISION_CONFIG.manual_review
  const confidencePercent = Math.round(confidence * 100)

  return (
    <div
      className={`card ${styles.decisionCard} ${config.className}`}
      id="final-decision-section"
      style={{
        background: `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`,
        borderColor: config.borderColor,
      }}
    >
      {/* Glow orb background effect */}
      <div
        className={styles.glowOrb}
        style={{ background: `radial-gradient(circle, ${config.accentColor}22 0%, transparent 70%)` }}
      />

      <div className={styles.decisionTop}>
        <div className={styles.iconWrapper} style={{ background: `${config.accentColor}20`, border: `1px solid ${config.accentColor}40` }}>
          <span className={styles.icon}>{config.icon}</span>
        </div>
        <div className={styles.decisionInfo}>
          <div className={styles.decisionMeta}>
            <span className={`tag ${config.tagClass}`}>{config.tagLabel}</span>
            <span className="tag tag-purple">{role_level}</span>
            {flags.includes('bias_risk_detected') && (
              <span className="tag tag-warning">⚠ Bias Risk</span>
            )}
          </div>
          <h2 className={styles.verdict} style={{ color: config.accentColor }}>
            {config.label}
          </h2>
        </div>
      </div>

      {/* Confidence */}
      <div className={styles.confidenceSection}>
        <div className={styles.confidenceHeader}>
          <span className={styles.confidenceLabel}>Decision Confidence</span>
          <span className={styles.confidenceValue} style={{ color: config.accentColor }}>
            {confidencePercent}%
          </span>
        </div>
        <div className="progress-bar-track" style={{ height: '8px' }}>
          <div
            className="progress-bar-fill"
            style={{
              width: `${confidencePercent}%`,
              background: `linear-gradient(90deg, ${config.accentColor}, ${config.accentColor}aa)`,
              boxShadow: `0 0 10px ${config.accentColor}66`,
            }}
          />
        </div>
      </div>

      <div className={styles.divider} />

      {/* Reasoning */}
      <div className={styles.reasoningSection}>
        <h4 className={styles.reasoningTitle}>Reasoning</h4>
        <ul className={styles.reasonList}>
          {reasons.map((reason, idx) => (
            <li key={idx} className={styles.reasonItem} style={{ animationDelay: `${idx * 0.1}s` }}>
              <span className={styles.reasonDot} style={{ background: config.accentColor }} />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
