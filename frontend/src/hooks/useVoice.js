import { useCallback, useEffect, useRef, useState } from 'react'

export function useVoice({ onResult, language = 'en-US' }) {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    setSupported(!!SpeechRecognition)

    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = language

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      onResult?.(transcript)
      setListening(false)
    }

    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)

    recognitionRef.current = recognition

    return () => {
      recognition.stop()
    }
  }, [language, onResult])

  const startListening = useCallback(() => {
    if (!recognitionRef.current || listening) return
    try {
      recognitionRef.current.lang = language
      recognitionRef.current.start()
      setListening(true)
    } catch {
      setListening(false)
    }
  }, [language, listening])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setListening(false)
  }, [])

  const speak = useCallback((text, lang) => {
    if (!text?.trim() || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang || language
    utterance.rate = 0.95
    window.speechSynthesis.speak(utterance)
  }, [language])

  return {
    listening,
    supported,
    startListening,
    stopListening,
    speak,
  }
}
