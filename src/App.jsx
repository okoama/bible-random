import { useEffect, useMemo, useState } from 'react'
import { offTheCuffTopics } from './data/offTheCuff.js'
import { deepResearchTopics } from './data/deepResearch.js'
import { ALL_TOPICS } from './data/topicIndex.js'
import { ModeSwitcher } from './components/ModeSwitcher.jsx'
import { CategoryPicker } from './components/CategoryPicker.jsx'
import { TopicArea } from './components/TopicArea.jsx'
import { SettingsDialog } from './components/SettingsDialog.jsx'
import { useSound } from './hooks/useSound.js'
import { useFocusRestore } from './hooks/useFocusRestore.js'
import { applyTheme, resolveTheme } from './themes.js'

const LS_KEYS = {
  speech: 'sacra-doctrina:speech',
  research: 'sacra-doctrina:research',
  muted: 'sacra-doctrina:muted',
  theme: 'sacra-doctrina:theme',
}

function loadSettings() {
  const read = (key, fallback) => {
    try {
      const v = Number(localStorage.getItem(key))
      return Number.isFinite(v) && v > 0 ? v : fallback
    } catch {
      return fallback
    }
  }
  const readMuted = () => {
    try {
      return localStorage.getItem(LS_KEYS.muted) === '1'
    } catch {
      return false
    }
  }
  const readTheme = () => {
    try {
      const v = localStorage.getItem(LS_KEYS.theme)
      return v === 'auto' || v === null ? 'auto' : v
    } catch {
      return 'auto'
    }
  }
  return {
    speech: read(LS_KEYS.speech, 1),
    research: read(LS_KEYS.research, 10),
    muted: readMuted(),
    theme: readTheme(),
  }
}

export default function App() {
  const [mode, setMode] = useState('off-the-cuff')
  const [categoryId, setCategoryId] = useState('surprise')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settings, setSettings] = useState(loadSettings)
  const sound = useSound(settings.muted)
  useFocusRestore(settingsOpen)

  const pool = useMemo(() => {
    if (mode === 'deep-research') return deepResearchTopics
    if (categoryId === 'surprise') return ALL_TOPICS
    return offTheCuffTopics[categoryId] || offTheCuffTopics.dogmatics
  }, [mode, categoryId])

  const poolKey = `${mode}:${categoryId}`

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEYS.speech, String(settings.speech))
      localStorage.setItem(LS_KEYS.research, String(settings.research))
      localStorage.setItem(LS_KEYS.muted, settings.muted ? '1' : '0')
      localStorage.setItem(LS_KEYS.theme, settings.theme)
    } catch {
      // Storage unavailable (private mode, quota): settings still work in memory.
    }
  }, [settings])

  const themeId = resolveTheme(settings.theme)

  useEffect(() => {
    applyTheme(themeId)
  }, [themeId])

  return (
    <main className="app">
      <header className="app__header">
        <button
          type="button"
          className="icon-btn"
          aria-label="Settings"
          aria-haspopup="dialog"
          onClick={() => setSettingsOpen(true)}
        >
          ⚙
        </button>
        <h1>Sacra Doctrina</h1>
        <p className="app__tagline">Spin a deep Catholic theological topic and speak.</p>
      </header>

      <ModeSwitcher value={mode} onChange={setMode} />

      {mode === 'off-the-cuff' && <CategoryPicker value={categoryId} onChange={setCategoryId} />}

      <TopicArea
        key={poolKey}
        pool={pool}
        mode={mode}
        categoryId={categoryId}
        settings={settings}
        sound={sound}
      />

      <footer className="app__footer">
        <p>Made for thinking on your feet.</p>
      </footer>

      <SettingsDialog
        open={settingsOpen}
        settings={settings}
        onOpenChange={setSettingsOpen}
        onChange={setSettings}
      />
    </main>
  )
}
