import { useEffect, useRef } from 'react'

export function useFocusRestore(open) {
  const prevRef = useRef(null)

  useEffect(() => {
    if (open) {
      prevRef.current = document.activeElement
    } else if (prevRef.current && document.contains(prevRef.current)) {
      prevRef.current.focus()
      prevRef.current = null
    }
  }, [open])
}
