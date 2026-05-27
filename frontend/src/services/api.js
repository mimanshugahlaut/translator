import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

export async function translateText(text, source, target) {
  const { data } = await client.post('/translate', { text, source, target })
  return data
}

export async function detectLanguage(text) {
  const { data } = await client.post('/detect', { text })
  return data
}

export async function fetchLanguages() {
  const { data } = await client.get('/languages')
  return data.languages
}
