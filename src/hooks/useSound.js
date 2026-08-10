import { useCallback, useEffect, useMemo, useRef } from 'react'

let sharedCtx = null

function getCtx() {
  if (typeof window === 'undefined') return null
  const Ctor = window.AudioContext || window.webkitAudioContext
  if (!Ctor) return null
  if (!sharedCtx) sharedCtx = new Ctor()
  if (sharedCtx.state === 'suspended') sharedCtx.resume()
  return sharedCtx
}

function tone(ctx, { freq, type = 'sine', gain = 0.06, start = 0, duration = 0.15 }) {
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  const t0 = ctx.currentTime + start
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.linearRampToValueAtTime(gain, t0 + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
  osc.connect(g)
  g.connect(ctx.destination)
  osc.start(t0)
  osc.stop(t0 + duration + 0.05)
}

export function useSound(muted) {
  const mutedRef = useRef(muted)
  useEffect(() => {
    mutedRef.current = muted
  }, [muted])

  const tick = useCallback(() => {
    if (mutedRef.current) return
    const ctx = getCtx()
    if (!ctx) return
    tone(ctx, { freq: 520, type: 'square', gain: 0.015, duration: 0.03 })
  }, [])

  const chime = useCallback(() => {
    if (mutedRef.current) return
    const ctx = getCtx()
    if (!ctx) return
    tone(ctx, { freq: 523.25, duration: 0.3 })
    tone(ctx, { freq: 659.25, start: 0.09, duration: 0.3 })
    tone(ctx, { freq: 783.99, start: 0.18, duration: 0.4 })
  }, [])

  const gong = useCallback(() => {
    if (mutedRef.current) return
    const ctx = getCtx()
    if (!ctx) return
    tone(ctx, { freq: 392, type: 'triangle', gain: 0.08, duration: 0.7 })
    tone(ctx, { freq: 523.25, type: 'triangle', start: 0.1, duration: 0.7 })
    tone(ctx, { freq: 659.25, type: 'triangle', start: 0.2, duration: 0.7 })
    tone(ctx, { freq: 783.99, type: 'triangle', start: 0.3, duration: 0.9 })
    tone(ctx, { freq: 1046.5, type: 'triangle', start: 0.45, duration: 1 })
  }, [])

  return useMemo(() => ({ tick, chime, gong }), [tick, chime, gong])
}
