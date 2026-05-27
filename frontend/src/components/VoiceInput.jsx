export default function VoiceInput({ listening, supported, onStart, onStop }) {
  if (!supported) {
    return (
      <button
        type="button"
        disabled
        title="Voice not supported in this browser"
        className="rounded-lg px-3 py-2 text-sm text-slate-400"
      >
        🎤 Voice
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={listening ? onStop : onStart}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
        listening
          ? 'bg-red-100 text-red-600 animate-pulse dark:bg-red-900/30'
          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
      }`}
    >
      {listening ? '⏹ Stop' : '🎤 Voice'}
    </button>
  )
}
