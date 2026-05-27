const MAX_CHARS = 500

export default function CharCounter({ count }) {
  const over = count > MAX_CHARS
  return (
    <span
      className={`text-xs tabular-nums ${
        over ? 'text-red-500 font-medium' : 'text-slate-400'
      }`}
    >
      {count} / {MAX_CHARS} chars
    </span>
  )
}

export { MAX_CHARS }
