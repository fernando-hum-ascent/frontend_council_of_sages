import {
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
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
          }
        } catch (error) {
          console.error('Auth state change error:', error)
          setError('Authentication error occurred')
          setUser(null)
          setAuthReady(false)
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
      }
      return token
    } catch (error) {
      console.error('Get ID token error:', error)
      return null
    }
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
