import { useEffect, useCallback, useRef } from 'react'
import { useAuth } from './useAuth'

interface SessionManagerOptions {
  timeoutMinutes?: number
  warningMinutes?: number
  onTimeout?: () => void
  onWarning?: () => void
}

export const useSessionManager = (options: SessionManagerOptions = {}) => {
  const { timeoutMinutes = 30, warningMinutes = 5, onTimeout, onWarning } = options
  const { signOut } = useAuth()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const warningRef = useRef<NodeJS.Timeout | null>(null)
  const lastActivityRef = useRef<number>(Date.now())
  const isWarningShownRef = useRef<boolean>(false)

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now()
    isWarningShownRef.current = false

    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (warningRef.current) clearTimeout(warningRef.current)

    // Set warning timer
    warningRef.current = setTimeout(() => {
      if (!isWarningShownRef.current) {
        isWarningShownRef.current = true
        onWarning?.()
      }
    }, (timeoutMinutes - warningMinutes) * 60 * 1000)

    // Set logout timer
    timeoutRef.current = setTimeout(async () => {
      console.log('Session timeout - logging out')
      await signOut()
      onTimeout?.()
    }, timeoutMinutes * 60 * 1000)
  }, [timeoutMinutes, warningMinutes, onTimeout, onWarning, signOut])

  const handleActivity = useCallback(() => {
    resetTimer()
  }, [resetTimer])

  const extendSession = useCallback(() => {
    resetTimer()
  }, [resetTimer])

  useEffect(() => {
    // Start the session timer
    resetTimer()

    // Add event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (warningRef.current) clearTimeout(warningRef.current)
    }
  }, [handleActivity, resetTimer])

  const getTimeRemaining = useCallback(() => {
    const elapsed = Date.now() - lastActivityRef.current
    const remaining = (timeoutMinutes * 60 * 1000) - elapsed
    return Math.max(0, Math.floor(remaining / 1000)) // seconds
  }, [timeoutMinutes])

  return {
    extendSession,
    getTimeRemaining,
    isWarningActive: isWarningShownRef.current
  }
}
