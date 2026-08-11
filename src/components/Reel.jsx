import { useEffect, useState } from 'react'
import { CopyButton } from './CopyButton.jsx'

export function Reel({ pool, topic, currentCategory, spinning, spinTarget, onLanded, onSpin, sound }) {
  const [display, setDisplay] = useState(topic)
  const [hasSpun, setHasSpun] = useState(false)

  // Intentionally exclude `topic`, `pool`, `sound`, `onLanded`: the animation must
  // not restart when those change mid-spin. The landing handler updates them all.
  useEffect(() => {
    if (!spinning || spinTarget == null) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      const raf = requestAnimationFrame(() => {
        setDisplay(spinTarget)
        setHasSpun(true)
        sound.chime()
        onLanded()
      })
      return () => cancelAnimationFrame(raf)
    }
    const from = pool.indexOf(topic)
    const to = pool.indexOf(spinTarget)
    const len = pool.length
    if (from < 0 || to < 0 || len === 0) return
    const distance = ((to - from) % len + len) % len
    const revolutions = 3 + Math.floor(Math.random() * 3)
    const totalSteps = revolutions * len + distance
    const duration = 4800
    const start = performance.now()
    let raf
    let lastStep = 0
    const frame = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const pos = totalSteps * eased
      const step = Math.floor(pos)
      if (step > lastStep) {
        lastStep = step
        sound.tick()
      }
      setDisplay(pool[(from + step) % len])
      if (t < 1) {
        raf = requestAnimationFrame(frame)
      } else {
        setDisplay(pool[to])
        setHasSpun(true)
        sound.chime()
        onLanded()
      }
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinning, spinTarget])

  const status = spinning ? 'Drawing…' : hasSpun ? 'Your topic' : 'Ready'

  return (
    <section className="reel">
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {status}
        {!spinning && topic ? `: ${topic}` : ''}
      </p>
      <div className="reel__status" aria-hidden="true">{status}</div>
      <div className="reel__topic" aria-hidden={spinning}>{display || '…'}</div>
      <div className="reel__meta">
        {currentCategory && (
          <span className="reel__category">
            <span aria-hidden="true">{currentCategory.emoji}</span> {currentCategory.label}
          </span>
        )}
        <span className="reel__count">{pool.length} topics</span>
      </div>
      <div className="reel__actions">
        <button
          type="button"
          className="btn btn--primary"
          onClick={onSpin}
          disabled={spinning}
        >
          {spinning ? 'Drawing…' : hasSpun ? 'Spin again' : 'Spin'}
        </button>
        <CopyButton text={topic || ''} disabled={spinning} />
      </div>
    </section>
  )
}
