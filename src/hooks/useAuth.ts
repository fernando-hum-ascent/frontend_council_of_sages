import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/authService'
import { useCallback } from 'react'

export function useAuth() {
  const { user, loading, error, initialized, isAuthenticated, setError } =
    useAuthStore()

  const signOut = useCallback(async () => {
    try {
      await authService.signOut()
    } catch (error) {
      console.error('Sign out failed:', error)
      setError('Failed to sign out')
    }
  }, [setError])

  const updateProfile = useCallback(
    async (updates: { displayName?: string; photoURL?: string }) => {
      try {
        await authService.updateUserProfile(updates)
      } catch (error) {
        console.error('Profile update failed:', error)
        setError('Failed to update profile')
        throw error
      }
    },
    [setError]
  )

  const refreshToken = useCallback(async (): Promise<string | null> => {
    try {
      return await authService.getIdToken(true)
    } catch (error) {
      console.error('Token refresh failed:', error)
      return null
    }
  }, [])

  return {
    // State
    user,
    loading,
    error,
    initialized,
    isAuthenticated,

    // Actions
    signOut,
    updateProfile,
    refreshToken,
    clearError: () => setError(null),
  }
}
