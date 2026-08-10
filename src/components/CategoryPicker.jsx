import { useEffect, useRef, useState } from 'react'
import { categories, surpriseOption } from '../data/categories.js'

const OPTIONS = [surpriseOption, ...categories]

export function CategoryPicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(value)
  const rootRef = useRef(null)
  const btnRef = useRef(null)
  const current = OPTIONS.find((o) => o.id === value) || surpriseOption

  useEffect(() => {
    const onClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        btnRef.current?.focus()
        return
      }
      const idx = OPTIONS.findIndex((o) => o.id === highlight)
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlight(OPTIONS[(idx + 1) % OPTIONS.length].id)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlight(OPTIONS[(idx - 1 + OPTIONS.length) % OPTIONS.length].id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, highlight])

  useEffect(() => {
    if (open) {
      const el = rootRef.current?.querySelector(`[data-id="${highlight}"]`)
      el?.focus()
    }
  }, [open, highlight])

  const select = (id) => {
    onChange(id)
    setOpen(false)
    btnRef.current?.focus()
  }

  return (
    <div className="select" ref={rootRef}>
      <button
        type="button"
        ref={btnRef}
        className="select__btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          setHighlight(value)
          setOpen((v) => !v)
        }}
      >
        <span className="select__current">
          <span aria-hidden="true">{current.emoji}</span> {current.label}
        </span>
        <span className="select__chevron" aria-hidden="true">
          ▾
        </span>
      </button>
      {open && (
        <div className="select__menu" role="listbox" aria-label="Category">
          {OPTIONS.map((o) => {
            const selected = o.id === value
            const active = o.id === highlight
            return (
              <button
                key={o.id}
                type="button"
                role="option"
                data-id={o.id}
                aria-selected={selected}
                tabIndex={active ? 0 : -1}
                className={
                  'select__option' +
                  (selected ? ' is-selected' : '') +
                  (active ? ' is-active' : '')
                }
                onClick={() => select(o.id)}
                onMouseEnter={() => setHighlight(o.id)}
              >
                <span aria-hidden="true">{o.emoji}</span>
                <span>{o.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
