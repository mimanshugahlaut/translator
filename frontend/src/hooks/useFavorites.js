import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'linguaai_favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setFavorites(JSON.parse(stored))
    } catch {
      setFavorites([])
    }
  }, [])

  const toggleFavorite = useCallback((code) => {
    setFavorites((prev) => {
      const next = prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const isFavorite = useCallback((code) => favorites.includes(code), [favorites])

  return { favorites, toggleFavorite, isFavorite }
}
