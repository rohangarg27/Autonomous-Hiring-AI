import { useState, useRef } from 'react'
import styles from './InputForm.module.css'

const ROLE_LEVELS = [
  { value: 'intern', label: 'Intern', icon: '🎓' },
  { value: 'junior', label: 'Junior', icon: '💼' },
  { value: 'senior', label: 'Senior', icon: '🚀' },
]

const SAMPLE_DATA = {
  resume_text: `Skills: Python, Machine Learning, PyTorch, TensorFlow, Deep Learning
Experience: Built deep learning models for image classification and NLP tasks. Developed a sentiment analysis system using transformer architectures. Worked on data preprocessing pipelines for large-scale ML projects.
Education: B.Tech Computer Science, 2024`,
  job_description: `We are hiring an ML intern with strong Python skills, experience in deep learning, and basic system design knowledge. The candidate should be familiar with modern ML frameworks and have hands-on experience building models.`,
  required_skills: ['Python', 'Deep Learning', 'System Design'],
  role_level: 'intern',
}

export default function InputForm({ onSubmit, isLoading }) {
  const [form, setForm] = useState({
    resume_text: '',
    job_description: '',
    required_skills: [],
    role_level: 'intern',
  })
  const [skillInput, setSkillInput] = useState('')
  const [errors, setErrors] = useState({})
  const skillInputRef = useRef(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function addSkill(e) {
    e.preventDefault()
    const trimmed = skillInput.trim()
    if (!trimmed) return
    if (form.required_skills.some(s => s.toLowerCase() === trimmed.toLowerCase())) return
    setForm(prev => ({ ...prev, required_skills: [...prev.required_skills, trimmed] }))
    setSkillInput('')
    skillInputRef.current?.focus()
  }

  function removeSkill(skill) {
    setForm(prev => ({ ...prev, required_skills: prev.required_skills.filter(s => s !== skill) }))
  }

  function loadSample() {
    setForm(SAMPLE_DATA)
    setErrors({})
  }

  function validate() {
    const newErrors = {}
    if (!form.resume_text.trim()) newErrors.resume_text = 'Resume text is required'
    if (!form.job_description.trim()) newErrors.job_description = 'Job description is required'
    if (form.required_skills.length === 0) newErrors.required_skills = 'Add at least one required skill'
    return newErrors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSubmit(form)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} id="evaluation-form">
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Candidate Evaluation</h2>
        <button type="button" className="btn btn-ghost" onClick={loadSample} id="load-sample-btn">
          ✨ Load Sample
        </button>
      </div>

      {/* Role Level */}
      <div className={styles.fieldGroup}>
        <label className="form-label">Role Level</label>
        <div className={styles.roleSelector}>
          {ROLE_LEVELS.map(role => (
            <button
              key={role.value}
              type="button"
              id={`role-${role.value}`}
              className={`${styles.roleBtn} ${form.role_level === role.value ? styles.roleBtnActive : ''}`}
              onClick={() => setForm(prev => ({ ...prev, role_level: role.value }))}
            >
              <span>{role.icon}</span>
              <span>{role.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Resume Text */}
      <div className={styles.fieldGroup}>
        <label className="form-label" htmlFor="resume-textarea">Resume Text</label>
        <div className={styles.textareaWrapper}>
          <textarea
            id="resume-textarea"
            name="resume_text"
            className={`form-textarea ${styles.textarea} ${errors.resume_text ? styles.fieldError : ''}`}
            placeholder="Paste the candidate's resume here — skills, experience, education..."
            rows={9}
            value={form.resume_text}
            onChange={handleChange}
          />
          <span className={styles.charCount}>{form.resume_text.length} chars</span>
        </div>
        {errors.resume_text && <p className={styles.errorMsg}>{errors.resume_text}</p>}
      </div>

      {/* Job Description */}
      <div className={styles.fieldGroup}>
        <label className="form-label" htmlFor="jd-textarea">Job Description</label>
        <div className={styles.textareaWrapper}>
          <textarea
            id="jd-textarea"
            name="job_description"
            className={`form-textarea ${styles.textarea} ${errors.job_description ? styles.fieldError : ''}`}
            placeholder="Describe the role, responsibilities, and what you're looking for..."
            rows={5}
            value={form.job_description}
            onChange={handleChange}
          />
          <span className={styles.charCount}>{form.job_description.length} chars</span>
        </div>
        {errors.job_description && <p className={styles.errorMsg}>{errors.job_description}</p>}
      </div>

      {/* Required Skills */}
      <div className={styles.fieldGroup}>
        <label className="form-label">Required Skills</label>
        <div className={styles.skillsContainer}>
          <div className={styles.skillTags}>
            {form.required_skills.map(skill => (
              <span key={skill} className={`tag tag-accent ${styles.skillTag}`}>
                {skill}
                <button
                  type="button"
                  className={styles.skillRemove}
                  onClick={() => removeSkill(skill)}
                  aria-label={`Remove ${skill}`}
                >
                  ×
                </button>
              </span>
            ))}
            {form.required_skills.length === 0 && (
              <span className={styles.skillsPlaceholder}>No skills added yet</span>
            )}
          </div>
          <div className={styles.skillInputRow}>
            <input
              ref={skillInputRef}
              id="skill-input"
              className="form-input"
              type="text"
              placeholder="Type a skill and press Add..."
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSkill(e)}
            />
            <button type="button" className="btn btn-ghost" onClick={addSkill} id="add-skill-btn">
              + Add
            </button>
          </div>
        </div>
        {errors.required_skills && <p className={styles.errorMsg}>{errors.required_skills}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        id="evaluate-btn"
        className={`btn btn-primary ${styles.submitBtn}`}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="spinner" />
            Running AI Agents...
          </>
        ) : (
          <>
            <span>⚡</span>
            Evaluate Candidate
          </>
        )}
      </button>
    </form>
  )
}
