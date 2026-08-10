import { useState } from 'react'

export function CopyButton({ text, disabled }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button type="button" className="btn" onClick={copy} disabled={disabled}>
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}
