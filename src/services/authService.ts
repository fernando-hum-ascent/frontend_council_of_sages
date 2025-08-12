import {
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth'
import { auth } from '@/config/firebase'
import { useAuthStore } from '@/store/authStore'
import { mapFirebaseUser } from '@/types/auth'

class AuthService {
  private unsubscribe: (() => void) | null = null

  /**
   * Initialize auth state listener
   */
  init() {
    const { setUser, setLoading, setError, setInitialized } =
      useAuthStore.getState()

    this.unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: FirebaseUser | null) => {
        try {
          setLoading(false)
          setInitialized(true)

          if (firebaseUser) {
            const user = mapFirebaseUser(firebaseUser)
            console.log('🟢 About to call setUser with:', user) // Add this
            setUser(user) // ← Check if this line executes
            console.log('🟡 setUser called') // Add this
          } else {
            setUser(null)
          }
        } catch (error) {
          console.error('Auth state change error:', error)
          setError('Authentication error occurred')
          setUser(null)
        }
      },
      (error) => {
        console.error('Auth state observer error:', error)
        setError('Authentication service error')
        setLoading(false)
        setInitialized(true)
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
   * Get current user ID token
   */
  async getIdToken(forceRefresh = false): Promise<string | null> {
    const currentUser = auth.currentUser
    if (!currentUser) {
      return null
    }

    try {
      return await currentUser.getIdToken(forceRefresh)
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
