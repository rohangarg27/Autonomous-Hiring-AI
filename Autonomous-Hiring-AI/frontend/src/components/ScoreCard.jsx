import { useEffect, useRef } from 'react'
import styles from './ScoreCard.module.css'

/**
 * Circular progress ring + label for a score metric.
 */
export default function ScoreCard({ label, score, color = 'var(--clr-accent)', size = 100 }) {
  const circleRef = useRef(null)
  const percentage = Math.round(score * 100)
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const dashoffset = circumference - (score * circumference)

  useEffect(() => {
    if (!circleRef.current) return
    // Animate from full dashoffset (0%) to target
    circleRef.current.style.strokeDashoffset = circumference
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (circleRef.current) {
          circleRef.current.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
          circleRef.current.style.strokeDashoffset = dashoffset
        }
      })
    })
  }, [score, dashoffset, circumference])

  const getScoreColor = () => {
    if (percentage >= 70) return 'var(--clr-success)'
    if (percentage >= 45) return 'var(--clr-warning)'
    return 'var(--clr-danger)'
  }

  const ringColor = color === 'auto' ? getScoreColor() : color

  return (
    <div className={styles.scoreCard} style={{ '--ring-color': ringColor }}>
      <div className={styles.ringWrapper} style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          className={styles.svg}
          role="img"
          aria-label={`${label}: ${percentage}%`}
        >
          {/* Background track */}
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
          />
          {/* Progress ring */}
          <circle
            ref={circleRef}
            cx="50" cy="50" r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            transform="rotate(-90 50 50)"
            style={{ filter: `drop-shadow(0 0 6px ${ringColor})` }}
          />
        </svg>
        <div className={styles.ringLabel}>
          <span className={styles.percentage} style={{ color: ringColor }}>
            {percentage}%
          </span>
        </div>
      </div>
      <p className={styles.metricLabel}>{label}</p>
    </div>
  )
}
