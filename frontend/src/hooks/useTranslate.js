import { useCallback, useEffect, useRef, useState } from 'react'
import { translateText } from '../services/api'

const DEBOUNCE_MS = 600

export function useTranslate(sourceLang, targetLang) {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [detectedSource, setDetectedSource] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const debounceRef = useRef(null)
  const abortRef = useRef(0)

  const runTranslate = useCallback(
    async (text, source, target) => {
      if (!text.trim()) {
        setOutputText('')
        setDetectedSource(null)
        setError(null)
        return
      }

      const requestId = ++abortRef.current
      setLoading(true)
      setError(null)

      try {
        const result = await translateText(text, source, target)
        if (requestId !== abortRef.current) return
        setOutputText(result.translated_text)
        setDetectedSource(result.detected_source ?? null)
      } catch (err) {
        if (requestId !== abortRef.current) return
        const message =
          err.response?.data?.detail || err.message || 'Translation failed'
        setError(typeof message === 'string' ? message : JSON.stringify(message))
        setOutputText('')
      } finally {
        if (requestId === abortRef.current) setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!inputText.trim()) {
      setOutputText('')
      setDetectedSource(null)
      setError(null)
      setLoading(false)
      return
    }

    debounceRef.current = setTimeout(() => {
      runTranslate(inputText, sourceLang, targetLang)
    }, DEBOUNCE_MS)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [inputText, sourceLang, targetLang, runTranslate])

  const clear = useCallback(() => {
    abortRef.current++
    setInputText('')
    setOutputText('')
    setDetectedSource(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    inputText,
    setInputText,
    outputText,
    detectedSource,
    loading,
    error,
    clear,
    retranslate: () => runTranslate(inputText, sourceLang, targetLang),
  }
}
