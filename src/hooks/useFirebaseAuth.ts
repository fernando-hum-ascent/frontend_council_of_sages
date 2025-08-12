import { useEffect } from 'react'
import { authService } from '@/services/authService'

/**
 * Initialize Firebase Auth listener
 * Should be called once at app startup
 */
export function useFirebaseAuth() {
  useEffect(() => {
    // Initialize auth service
    authService.init()

    // Cleanup on unmount
    return () => {
      authService.destroy()
    }
  }, [])
}
