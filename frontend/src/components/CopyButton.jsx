import { useState } from 'react'

export default function CopyButton({ text, disabled }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!text?.trim()) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={disabled || !text?.trim()}
      className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      {copied ? '✓ Copied' : '📋 Copy'}
    </button>
  )
}
