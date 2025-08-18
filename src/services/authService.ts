import {
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  type User as FirebaseUser,
  type ActionCodeSettings,
} from 'firebase/auth'
import { auth } from '@/config/firebase'
import { useAuthStore } from '@/store/authStore'
import { useBalanceStore } from '@/store/balanceStore'
import { mapFirebaseUser } from '@/types/auth'

class AuthService {
  private unsubscribe: (() => void) | null = null

  /**
   * Initialize auth state listener
   */
  init() {
    const { setUser, setLoading, setError, setInitialized, setAuthReady } =
      useAuthStore.getState()

    this.unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: FirebaseUser | null) => {
        try {
          setLoading(false)
          setInitialized(true)

          if (firebaseUser) {
            const user = mapFirebaseUser(firebaseUser)
            setUser(user)
            // Set authReady only after user is set and Firebase auth is confirmed ready
            setAuthReady(true)
          } else {
            setUser(null)
            setAuthReady(false)
            // Clear sensitive state when transitioning to unauthenticated
            useBalanceStore.getState().clear()
          }
        } catch (error) {
          console.error('Auth state change error:', error)
          setError('Authentication error occurred')
          setUser(null)
          setAuthReady(false)
          // Ensure sensitive state is cleared on auth errors
          useBalanceStore.getState().clear()
        }
      },
      (error) => {
        console.error('Auth state observer error:', error)
        setError('Authentication service error')
        setLoading(false)
        setInitialized(true)
        setAuthReady(false)
      }
    )
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth)
      useAuthStore.getState().clearAuth()
      useBalanceStore.getState().clear()
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(updates: {
    displayName?: string
    photoURL?: string
  }): Promise<void> {
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error('No authenticated user')
    }

    try {
      await updateProfile(currentUser, updates)

      // Update local store
      useAuthStore.getState().updateUser(updates)
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  }

  /**
   * Check if auth is ready for making authenticated requests
   */
  isAuthReady(): boolean {
    const { isAuthenticated, authReady } = useAuthStore.getState()
    return isAuthenticated && authReady && !!auth.currentUser
  }

  /**
   * Get current user ID token with readiness check
   */
  async getIdToken(forceRefresh = false): Promise<string | null> {
    const currentUser = auth.currentUser
    if (!currentUser) {
      console.warn('getIdToken: No current user available')
      return null
    }

    // Additional check for auth readiness
    if (!this.isAuthReady()) {
      console.warn('getIdToken: Auth not ready yet')
      return null
    }

    try {
      const token = await currentUser.getIdToken(forceRefresh)
      if (!token) {
        console.warn('getIdToken: Token is empty')
        return null
      }
      return token
    } catch (error) {
      console.error('Get ID token error:', error)
      return null
    }
  }

  /**
   * Send email verification to current user
   */
  async sendVerificationEmail(
    actionCodeSettings?: ActionCodeSettings
  ): Promise<void> {
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error('No authenticated user')
    }

    try {
      await sendEmailVerification(currentUser, actionCodeSettings)
    } catch (error) {
      console.error('Send verification email error:', error)
      throw error
    }
  }

  /**
   * Reload current user to get updated email verification status
   */
  async reloadCurrentUser(): Promise<void> {
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error('No authenticated user')
    }

    try {
      await currentUser.reload()

      // Update local store with fresh user data
      const user = mapFirebaseUser(currentUser)
      useAuthStore.getState().setUser(user)
    } catch (error) {
      console.error('Reload user error:', error)
      throw error
    }
  }

  /**
   * Check if user's email is verified
   */
  isEmailVerified(user?: FirebaseUser | null): boolean {
    const currentUser = user || auth.currentUser
    return currentUser?.emailVerified ?? false
  }

  /**
   * Clean up auth listener
   */
  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
    }
  }
}

export const authService = new AuthService()
export default authService
