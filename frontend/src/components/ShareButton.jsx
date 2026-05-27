import { useState } from 'react'

export default function ShareButton({ sourceText, translatedText, sourceLang, targetLang }) {
  const [shared, setShared] = useState(false)

  const handleShare = async () => {
    if (!translatedText?.trim()) return

    const card = `🌐 LinguaAI Translation\n\nOriginal (${sourceLang}):\n${sourceText}\n\nTranslation (${targetLang}):\n${translatedText}\n\n— Shared via LinguaAI`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'LinguaAI Translation',
          text: card,
        })
        return
      } catch {
        /* fall through to clipboard */
      }
    }

    try {
      await navigator.clipboard.writeText(card)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    } catch {
      /* unavailable */
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      disabled={!translatedText?.trim()}
      className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      {shared ? '✓ Shared' : '🔗 Share'}
    </button>
  )
}
