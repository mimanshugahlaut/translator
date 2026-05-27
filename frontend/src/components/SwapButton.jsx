export default function SwapButton({ onSwap, disabled }) {
  return (
    <button
      type="button"
      onClick={onSwap}
      disabled={disabled}
      title="Swap languages"
      className="mt-6 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200/50 bg-white/50 text-lg shadow-sm backdrop-blur transition-all hover:scale-110 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:opacity-40 dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:bg-slate-800"
    >
      ⇄
    </button>
  )
}
