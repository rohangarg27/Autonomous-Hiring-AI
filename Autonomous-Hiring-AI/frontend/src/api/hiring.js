import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 120000, // ML models can be slow on first load
})

/**
 * Evaluate a candidate through the full autonomous hiring pipeline.
 * @param {Object} payload
 * @param {string} payload.resume_text
 * @param {string} payload.job_description
 * @param {string[]} payload.required_skills
 * @param {string} payload.role_level
 * @returns {Promise<import('../types').EvaluationResponse>}
 */
export async function evaluateCandidate(payload) {
  const { data } = await api.post('/evaluate', payload)
  return data
}

export async function healthCheck() {
  const { data } = await api.get('/health')
  return data
}
