import TranslatorBox from './components/TranslatorBox'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const { dark, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-500">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-400/20 blur-[120px] dark:bg-brand-600/20 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/20 blur-[120px] dark:bg-purple-600/20 pointer-events-none" />
      
      <header className="relative z-10 border-b border-slate-200/50 bg-white/60 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 sticky top-0">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 shadow-lg shadow-brand-500/20 text-white">
              <span className="text-xl" aria-hidden>
                ✨
              </span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                LinguaAI
              </h1>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Next-gen translation
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggle}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/50 bg-white/50 text-slate-600 shadow-sm backdrop-blur transition-all hover:scale-105 hover:bg-white dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle dark mode"
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center animate-fade-in-up">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Break the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-600">Language Barrier</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Real-time, AI-powered translation for over 50 languages. Seamlessly connect with the world.
          </p>
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <TranslatorBox />
        </div>
      </main>

      <footer className="relative z-10 pb-8 text-center text-sm font-medium text-slate-400">
        Built with React + FastAPI · Powered by AI
      </footer>
    </div>
  )
}
