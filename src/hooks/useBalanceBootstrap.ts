import { useEffect, useCallback, useRef } from 'react'
import { useAuth } from './useAuth'
import { useBalanceStore } from '@/store/balanceStore'

const VISIBILITY_DEBOUNCE_MS = 250

/**
 * Bootstrap balance functionality
 * - Fetches balance when user becomes authenticated
 * - Refetches on tab visibility change
 * - Should be called once at app startup
 */
export function useBalanceBootstrap() {
  const { isAuthenticated, authReady } = useAuth()
  const fetchBalance = useBalanceStore((state) => state.fetchBalance)
  const clear = useBalanceStore((state) => state.clear)

  const visibilityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  )

  // Debounced visibility handler
  const handleVisibilityChange = useCallback(() => {
    if (visibilityTimeoutRef.current !== null) {
      clearTimeout(visibilityTimeoutRef.current)
      visibilityTimeoutRef.current = null
    }

    visibilityTimeoutRef.current = setTimeout(() => {
      if (
        document.visibilityState === 'visible' &&
        isAuthenticated &&
        authReady
      ) {
        fetchBalance()
      }
    }, VISIBILITY_DEBOUNCE_MS)
  }, [isAuthenticated, authReady, fetchBalance])

  // Watch auth status and fetch balance when authenticated AND auth is ready
  useEffect(() => {
    if (isAuthenticated && authReady) {
      fetchBalance()
    } else if (!isAuthenticated) {
      clear()
    }
  }, [isAuthenticated, authReady, fetchBalance, clear])

  // Setup visibility change listener
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (visibilityTimeoutRef.current !== null) {
        clearTimeout(visibilityTimeoutRef.current)
        visibilityTimeoutRef.current = null
      }
    }
  }, [handleVisibilityChange])
}
