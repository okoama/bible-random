import { useCallback, useEffect, useRef, useState } from 'react'

export function useTimer(onDone) {
  const [total, setTotal] = useState(0)
  const [remaining, setRemaining] = useState(0)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const endRef = useRef(0)
  const rafRef = useRef(null)
  const onDoneRef = useRef(onDone)

  useEffect(() => {
    onDoneRef.current = onDone
  }, [onDone])

  const start = useCallback((seconds) => {
    setTotal(seconds)
    setRemaining(seconds)
    setDone(false)
    endRef.current = performance.now() + seconds * 1000
    setRunning(true)
  }, [])

  const stop = useCallback(() => {
    setRunning(false)
  }, [])

  useEffect(() => {
    if (!running) return
    const frame = () => {
      const msLeft = endRef.current - performance.now()
      const secs = Math.max(0, Math.ceil(msLeft / 1000))
      setRemaining(secs)
      if (msLeft <= 0) {
        setRemaining(0)
        setRunning(false)
        setDone(true)
        onDoneRef.current?.()
        return
      }
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafRef.current)
  }, [running])

  return { total, remaining, running, done, start, stop }
}
