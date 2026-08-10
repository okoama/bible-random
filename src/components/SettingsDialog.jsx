import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export function SettingsDialog({ open, settings, onOpenChange, onChange }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!open) return
    dialogRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onOpenChange(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  if (!open) return null

  return createPortal(
    <div className="overlay">
      <div
        className="overlay__dialog settings"
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        ref={dialogRef}
        tabIndex={-1}
      >
        <h2 className="settings__title">Settings</h2>
        <label className="field">
          <span className="field__label">
            Speech timer &mdash; {settings.speech} min
          </span>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={settings.speech}
            onChange={(e) => onChange({ ...settings, speech: Number(e.target.value) })}
          />
        </label>
        <label className="field">
          <span className="field__label">
            Research timer &mdash; {settings.research} min{' '}
            <em className="field__hint">(deep research only)</em>
          </span>
          <input
            type="range"
            min="1"
            max="60"
            step="1"
            value={settings.research}
            onChange={(e) => onChange({ ...settings, research: Number(e.target.value) })}
          />
        </label>
        <label className="field field--row">
          <input
            type="checkbox"
            checked={settings.muted}
            onChange={(e) => onChange({ ...settings, muted: e.target.checked })}
          />
          <span>Mute sound effects</span>
        </label>
        <div className="settings__actions">
          <button type="button" className="btn btn--primary" onClick={() => onOpenChange(false)}>
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
