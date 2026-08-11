import { createPortal } from 'react-dom'
import { useDialog } from '../hooks/useDialog.js'
import { THEME_IDS, THEME_LABELS } from '../themes.js'

export function SettingsDialog({ open, settings, onOpenChange, onChange }) {
  const dialogRef = useDialog({ open, onClose: () => onOpenChange(false) })

  if (!open) return null

  return createPortal(
    <div className="overlay">
      <div
        className="overlay__dialog settings"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        ref={dialogRef}
        tabIndex={-1}
      >
        <h2 id="settings-title" className="settings__title">Settings</h2>
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
        <label className="field">
          <span className="field__label">
            Theme{' '}
            <em className="field__hint">(auto follows the liturgical season)</em>
          </span>
          <select
            className="field__select"
            value={settings.theme}
            onChange={(e) => onChange({ ...settings, theme: e.target.value })}
          >
            <option value="auto">Automatic — liturgical season</option>
            {THEME_IDS.map((id) => (
              <option key={id} value={id}>
                {THEME_LABELS[id]}
              </option>
            ))}
          </select>
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
