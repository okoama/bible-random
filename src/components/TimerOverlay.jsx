import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useTimer } from '../hooks/useTimer.js'
import { useDialog } from '../hooks/useDialog.js'

const ARC = ['What?', 'So what?', 'Now what?']

function arcLit(remaining, total, done) {
  if (done) return 3
  if (total <= 0) return 3
  const frac = remaining / total
  if (frac > 2 / 3) return 3
  if (frac > 1 / 3) return 2
  return 1
}

function fmt(secs) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function TimerOverlay({ mode, topic, settings, sound, onClose }) {
  const isResearchMode = mode === 'deep-research'
  const [stage, setStage] = useState(isResearchMode ? 'research' : 'speech')
  const dialogRef = useDialog({ open: true, onClose })
  const speechTimer = useTimer(() => sound.gong())
  const researchTimer = useTimer(() => {
    sound.gong()
    setStage('ready')
  })

  const startResearch = () => researchTimer.start(settings.research * 60)
  const finishResearch = () => {
    researchTimer.stop()
    setStage('ready')
  }
  const startSpeech = () => {
    setStage('speech')
    speechTimer.start(settings.speech * 60)
  }

  const activeTimer =
    stage === 'research' ? researchTimer : stage === 'speech' ? speechTimer : null
  const pct = activeTimer && activeTimer.total > 0 ? (activeTimer.remaining / activeTimer.total) * 100 : 100
  const displayTotal = stage === 'research' ? settings.research * 60 : settings.speech * 60
  const timeText = activeTimer && activeTimer.total > 0 ? fmt(activeTimer.remaining) : fmt(displayTotal)

  let statusText
  let phaseLabel
  if (stage === 'research') {
    statusText = researchTimer.running ? 'Researching.' : researchTimer.done ? 'Research done.' : 'Research.'
    phaseLabel = 'Research timer'
  } else if (stage === 'ready') {
    statusText = 'Ready to speak.'
    phaseLabel = 'Ready to speak'
  } else {
    statusText = speechTimer.running ? 'Speak.' : speechTimer.done ? 'Time.' : 'Ready.'
    phaseLabel = 'Speech timer'
  }

  let primaryBtn = null
  if (stage === 'research') {
    if (!researchTimer.running && !researchTimer.done) {
      primaryBtn = (
        <button type="button" className="btn btn--primary" onClick={startResearch}>
          Start {settings.research} min research
        </button>
      )
    } else if (researchTimer.running) {
      primaryBtn = (
        <button type="button" className="btn btn--primary" onClick={finishResearch}>
          Done researching
        </button>
      )
    }
  } else if (stage === 'ready') {
    primaryBtn = (
      <button type="button" className="btn btn--primary" onClick={startSpeech}>
        I&rsquo;m ready to speak
      </button>
    )
  } else if (!speechTimer.running && !speechTimer.done && !isResearchMode) {
    primaryBtn = (
      <button type="button" className="btn btn--primary" onClick={startSpeech}>
        Start {settings.speech} min timer
      </button>
    )
  }

  const lit = stage === 'speech' ? arcLit(speechTimer.remaining, speechTimer.total, speechTimer.done) : 0

  return createPortal(
    <div className="overlay">
      <div
        className="overlay__dialog timer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="timer-phase"
        ref={dialogRef}
        tabIndex={-1}
      >
        <div className="timer__topic">{topic}</div>
        <div id="timer-phase" className="timer__phase">{phaseLabel}</div>
        <div className="timer-ring" style={{ '--p': pct }}>
          <div className="timer-ring__inner">
            <div className="timer__time">{timeText}</div>
            <div className="timer__hint">{statusText}</div>
          </div>
        </div>
        {stage === 'ready' && (
          <div className="timer__upnext">Up next: {settings.speech} min to speak.</div>
        )}
        {stage === 'speech' && (
          <ol className="arc">
            {ARC.map((a, i) => (
              <li key={a} className={i < lit ? 'is-hit' : ''}>
                {a}
              </li>
            ))}
          </ol>
        )}
        <div className="timer__buttons">
          {primaryBtn}
          <button type="button" className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
