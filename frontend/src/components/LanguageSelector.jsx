import { useMemo, useState } from 'react'

export default function LanguageSelector({
  languages,
  value,
  onChange,
  label,
  favorites = [],
  onToggleFavorite,
}) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const selected = languages.find((l) => l.code === value)
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const list = languages.filter(
      (l) =>
        l.name.toLowerCase().includes(q) || l.code.toLowerCase().includes(q),
    )
    if (favorites.length) {
      const favs = list.filter((l) => favorites.includes(l.code))
      const rest = list.filter((l) => !favorites.includes(l.code))
      return [...favs, ...rest]
    }
    return list
  }, [languages, search, favorites])

  return (
    <div className="relative flex-1">
      <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl border border-slate-200/50 bg-white/50 px-4 py-2.5 text-left text-sm font-medium shadow-sm backdrop-blur transition-all hover:border-brand-400 hover:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:bg-slate-800"
      >
        <span>{selected?.name ?? value}</span>
        <span className="text-slate-400">▼</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute left-0 right-0 z-20 mt-2 max-h-64 overflow-hidden rounded-2xl border border-slate-200/50 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/80">
            <div className="border-b border-slate-100 p-2 dark:border-slate-800">
              <input
                type="text"
                placeholder="Search languages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200/50 bg-white/50 px-3 py-2 text-sm outline-none transition-colors focus:border-brand-500 focus:bg-white dark:border-slate-700/50 dark:bg-slate-900/50 dark:focus:bg-slate-900"
                autoFocus
              />
            </div>
            <ul className="scrollbar-thin max-h-48 overflow-y-auto py-1">
              {value !== 'auto' && (
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onChange('auto')
                      setOpen(false)
                      setSearch('')
                    }}
                    className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-brand-50 dark:hover:bg-slate-800"
                  >
                    Detect language
                  </button>
                </li>
              )}
              {filtered.map((lang) => (
                <li key={lang.code} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      onChange(lang.code)
                      setOpen(false)
                      setSearch('')
                    }}
                    className={`flex flex-1 items-center px-4 py-2 text-left text-sm hover:bg-brand-50 dark:hover:bg-slate-800 ${
                      lang.code === value ? 'bg-brand-50 text-brand-700 dark:bg-slate-800' : ''
                    }`}
                  >
                    <span className="flex-1">{lang.name}</span>
                    <span className="text-xs text-slate-400">{lang.code}</span>
                  </button>
                  {onToggleFavorite && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleFavorite(lang.code)
                      }}
                      className="px-2 text-sm text-amber-500 hover:text-amber-600"
                      title={favorites.includes(lang.code) ? 'Unpin' : 'Pin'}
                    >
                      {favorites.includes(lang.code) ? '★' : '☆'}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
