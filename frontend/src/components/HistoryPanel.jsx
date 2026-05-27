export default function HistoryPanel({ history, onSelect, onClear }) {
  if (!history.length) return null

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          📜 Recent translations
        </h3>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-slate-400 hover:text-red-500"
        >
          Clear all
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item)}
            className="max-w-xs truncate rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 transition hover:border-brand-300 hover:bg-brand-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            title={`${item.sourceText} → ${item.translatedText}`}
          >
            &quot;{item.sourceText.slice(0, 24)}
            {item.sourceText.length > 24 ? '…' : ''}&quot; → &quot;
            {item.translatedText.slice(0, 24)}
            {item.translatedText.length > 24 ? '…' : ''}&quot;
          </button>
        ))}
      </div>
    </div>
  )
}
