import { useRef, useState } from 'react'
import { categories, deepResearchCategory } from '../data/categories.js'
import { TOPIC_TO_CATEGORY } from '../data/topicIndex.js'
import { useFocusRestore } from '../hooks/useFocusRestore.js'
import { Reel } from './Reel.jsx'
import { TimerOverlay } from './TimerOverlay.jsx'

function resolveCategory(topic, mode, categoryId) {
  if (mode === 'deep-research') return deepResearchCategory
  if (categoryId === 'surprise') return TOPIC_TO_CATEGORY.get(topic) || null
  return categories.find((c) => c.id === categoryId) || null
}

export function TopicArea({ pool, mode, categoryId, settings, sound }) {
  const [topic, setTopic] = useState(() => pool[Math.floor(Math.random() * pool.length)])
  const [currentCategory, setCurrentCategory] = useState(() =>
    resolveCategory(topic, mode, categoryId),
  )
  const [spinning, setSpinning] = useState(false)
  const [spinTarget, setSpinTarget] = useState(null)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const seenRef = useRef(new Set([topic]))
  useFocusRestore(overlayOpen)

  const handleSpin = () => {
    const unseen = pool.filter((t) => !seenRef.current.has(t))
    const candidates = unseen.length ? unseen : pool
    const target = candidates[Math.floor(Math.random() * candidates.length)]
    seenRef.current.add(target)
    setSpinTarget(target)
    setSpinning(true)
  }

  const handleLanded = () => {
    setTopic(spinTarget)
    setCurrentCategory(resolveCategory(spinTarget, mode, categoryId))
    setSpinning(false)
    setSpinTarget(null)
  }

  return (
    <>
      <Reel
        pool={pool}
        topic={topic}
        currentCategory={currentCategory}
        spinning={spinning}
        spinTarget={spinTarget}
        onLanded={handleLanded}
        onSpin={handleSpin}
        sound={sound}
      />

      <div className="app__cta">
        <button type="button" className="btn btn--primary" onClick={() => setOverlayOpen(true)}>
          {mode === 'off-the-cuff'
            ? `Start ${settings.speech} min timer`
            : `Start ${settings.research} min research`}
        </button>
      </div>

      {overlayOpen && (
        <TimerOverlay
          mode={mode}
          topic={topic}
          settings={settings}
          sound={sound}
          onClose={() => setOverlayOpen(false)}
        />
      )}
    </>
  )
}
