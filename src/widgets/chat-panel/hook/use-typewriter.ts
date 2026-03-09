'use client'

import { useState, useEffect, useRef } from 'react'

/**
 * Simulates AI token streaming with a typewriter effect.
 * In production: replace with a ReadableStream from the AI backend.
 */
export function useTypewriter(text: string, speed = 18) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0

    intervalRef.current = setInterval(() => {
      if (i >= text.length) {
        setDone(true)
        if (intervalRef.current) clearInterval(intervalRef.current)
        return
      }
      setDisplayed(text.slice(0, i + 1))
      i++
    }, speed)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [text, speed])

  return { displayed, done }
}
