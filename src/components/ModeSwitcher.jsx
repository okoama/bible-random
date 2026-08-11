import { useRef } from 'react'

const MODES = [
  {
    id: 'off-the-cuff',
    label: 'Off the cuff',
    emoji: '🧠',
    blurb: 'Minimal prep. Try to think quick on your feet.',
  },
  {
    id: 'deep-research',
    label: 'Deep research',
    emoji: '🔍',
    blurb: "Spin a topic, set a research timer, then start the speech timer whenever you're ready.",
  },
]

export function ModeSwitcher({ value, onChange }) {
  const refs = useRef({})

  const onKeyDown = (e, index) => {
    let nextIndex
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextIndex = (index + 1) % MODES.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') nextIndex = (index - 1 + MODES.length) % MODES.length
    else if (e.key === 'Home') nextIndex = 0
    else if (e.key === 'End') nextIndex = MODES.length - 1
    else return
    e.preventDefault()
    const next = MODES[nextIndex]
    onChange(next.id)
    refs.current[next.id]?.focus()
  }

  return (
    <div className="modes" role="radiogroup" aria-label="Practice mode">
      {MODES.map((m, i) => {
        const active = value === m.id
        return (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={active}
            ref={(el) => {
              refs.current[m.id] = el
            }}
            className={active ? 'mode-pill is-active' : 'mode-pill'}
            onClick={() => onChange(m.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            tabIndex={active ? 0 : -1}
          >
            <span className="mode-pill__emoji">{m.emoji}</span>
            <span className="mode-pill__body">
              <span className="mode-pill__label">{m.label}</span>
              <span className="mode-pill__blurb">{m.blurb}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
