import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchLanguages } from '../services/api'
import { useFavorites } from '../hooks/useFavorites'
import { useHistory } from '../hooks/useHistory'
import { useTranslate } from '../hooks/useTranslate'
import { useVoice } from '../hooks/useVoice'
import CharCounter, { MAX_CHARS } from './CharCounter'
import CopyButton from './CopyButton'
import HistoryPanel from './HistoryPanel'
import LanguageSelector from './LanguageSelector'
import ShareButton from './ShareButton'
import SwapButton from './SwapButton'
import VoiceInput from './VoiceInput'

const SPEECH_LANG_MAP = {
  en: 'en-US',
  hi: 'hi-IN',
  fr: 'fr-FR',
  es: 'es-ES',
  de: 'de-DE',
  ja: 'ja-JP',
  ko: 'ko-KR',
  zh: 'zh-CN',
  ar: 'ar-SA',
  pt: 'pt-BR',
  ru: 'ru-RU',
  it: 'it-IT',
}

export default function TranslatorBox() {
  const [sourceLang, setSourceLang] = useState('auto')
  const [targetLang, setTargetLang] = useState('hi')
  const [languages, setLanguages] = useState([
    { code: 'auto', name: 'Detect language' },
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
  ])
  const [langsLoading, setLangsLoading] = useState(true)

  const { favorites, toggleFavorite } = useFavorites()
  const { history, addEntry, clearHistory, loadEntry } = useHistory()

  const {
    inputText,
    setInputText,
    outputText,
    detectedSource,
    loading,
    error,
    clear,
  } = useTranslate(sourceLang, targetLang)

  const sourceLanguages = useMemo(
    () => [{ code: 'auto', name: 'Detect language' }, ...languages.filter((l) => l.code !== 'auto')],
    [languages],
  )

  const targetLanguages = useMemo(
    () => languages.filter((l) => l.code !== 'auto'),
    [languages],
  )

  const speechLang = SPEECH_LANG_MAP[targetLang] || `${targetLang}`

  const handleVoiceResult = useCallback(
    (transcript) => {
      setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript))
    },
    [setInputText],
  )

  const { listening, supported, startListening, stopListening, speak } = useVoice({
    onResult: handleVoiceResult,
    language: SPEECH_LANG_MAP[sourceLang === 'auto' ? 'en' : sourceLang] || 'en-US',
  })

  useEffect(() => {
    fetchLanguages()
      .then((langs) => {
        setLanguages(langs)
      })
      .catch(() => {
        /* keep defaults */
      })
      .finally(() => setLangsLoading(false))
  }, [])

  useEffect(() => {
    if (outputText && inputText && !loading && !error) {
      addEntry({
        sourceText: inputText,
        translatedText: outputText,
        sourceLang: detectedSource || sourceLang,
        targetLang,
      })
    }
  }, [outputText, loading, error, inputText, detectedSource, sourceLang, targetLang, addEntry])

  const handleSwap = () => {
    if (sourceLang === 'auto') {
      if (detectedSource) {
        setSourceLang(targetLang)
        setTargetLang(detectedSource)
        if (outputText) setInputText(outputText)
      }
      return
    }
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    if (outputText) setInputText(outputText)
  }

  const handleHistorySelect = (entry) => {
    const loaded = loadEntry(entry)
    setInputText(loaded.sourceText)
    setSourceLang(loaded.sourceLang === 'auto' ? 'auto' : loaded.sourceLang)
    setTargetLang(loaded.targetLang)
  }

  const handleInputChange = (e) => {
    const val = e.target.value
    if (val.length <= MAX_CHARS) setInputText(val)
  }

  const effectiveSource =
    sourceLang === 'auto' && detectedSource ? detectedSource : sourceLang

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all dark:border-slate-700/40 dark:bg-slate-900/60 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
        <div className="flex flex-col gap-3 border-b border-slate-200/50 p-5 sm:flex-row sm:items-end dark:border-slate-700/50">
          <LanguageSelector
            languages={sourceLanguages}
            value={sourceLang}
            onChange={setSourceLang}
            label="From"
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
          <SwapButton onSwap={handleSwap} disabled={langsLoading} />
          <LanguageSelector
            languages={targetLanguages}
            value={targetLang}
            onChange={setTargetLang}
            label="To"
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        </div>

        {sourceLang === 'auto' && detectedSource && (
          <p className="border-b border-slate-50 px-4 py-1.5 text-xs text-brand-600 dark:border-slate-800">
            Detected: {languages.find((l) => l.code === detectedSource)?.name ?? detectedSource}
          </p>
        )}

        <div className="grid min-h-[280px] grid-cols-1 md:grid-cols-2">
          <div className="group flex flex-col border-b border-slate-200/50 md:border-b-0 md:border-r dark:border-slate-700/50 transition-colors focus-within:bg-white/40 dark:focus-within:bg-slate-800/40">
            <textarea
              value={inputText}
              onChange={handleInputChange}
              placeholder="Type your text here..."
              className="min-h-[250px] flex-1 resize-none bg-transparent p-6 text-lg outline-none placeholder:text-slate-400/70 transition-colors"
              spellCheck
            />
            <div className="flex items-center justify-between gap-2 border-t border-slate-200/50 px-4 py-3 opacity-70 transition-opacity group-focus-within:opacity-100 dark:border-slate-700/50">
              <div className="flex gap-1">
                <VoiceInput
                  listening={listening}
                  supported={supported}
                  onStart={startListening}
                  onStop={stopListening}
                />
                <button
                  type="button"
                  onClick={clear}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  ✖ Clear
                </button>
              </div>
              <CharCounter count={inputText.length} />
            </div>
          </div>

          <div className="flex flex-col bg-brand-50/10 dark:bg-brand-900/10">
            <div className="relative min-h-[250px] flex-1 p-6">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm dark:bg-slate-900/40">
                  <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-brand-500 border-t-transparent" />
                </div>
              )}
              {error ? (
                <div className="flex h-full items-center justify-center">
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</p>
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-lg font-medium leading-relaxed text-brand-900 dark:text-brand-100">
                  {outputText || (
                    <span className="text-slate-400/70 font-normal">
                      Translation will appear here...
                    </span>
                  )}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 border-t border-slate-200/50 px-4 py-3 dark:border-slate-700/50">
              <CopyButton text={outputText} disabled={loading} />
              <button
                type="button"
                onClick={() => speak(outputText, speechLang)}
                disabled={!outputText?.trim()}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                🔊 Speak
              </button>
              <ShareButton
                sourceText={inputText}
                translatedText={outputText}
                sourceLang={effectiveSource}
                targetLang={targetLang}
              />
            </div>
          </div>
        </div>
      </div>

      <HistoryPanel
        history={history}
        onSelect={handleHistorySelect}
        onClear={clearHistory}
      />
    </div>
  )
}
