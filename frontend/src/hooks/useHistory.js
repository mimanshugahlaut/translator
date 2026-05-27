import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'linguaai_history'
const MAX_ENTRIES = 20

export function useHistory() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setHistory(JSON.parse(stored))
    } catch {
      setHistory([])
    }
  }, [])

  const addEntry = useCallback((entry) => {
    setHistory((prev) => {
      const next = [
        {
          id: Date.now(),
          sourceText: entry.sourceText,
          translatedText: entry.translatedText,
          sourceLang: entry.sourceLang,
          targetLang: entry.targetLang,
          timestamp: new Date().toISOString(),
        },
        ...prev.filter(
          (h) =>
            !(
              h.sourceText === entry.sourceText &&
              h.targetLang === entry.targetLang
            ),
        ),
      ].slice(0, MAX_ENTRIES)

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const loadEntry = useCallback((entry) => entry, [])

  return { history, addEntry, clearHistory, loadEntry }
}
