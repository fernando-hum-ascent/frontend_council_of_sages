import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AuthState } from '@/types/auth'

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setInitialized: (initialized: boolean) => void
  setAuthReady: (authReady: boolean) => void
  clearAuth: () => void
  updateUser: (updates: Partial<User>) => void
  isAuthenticated: boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      loading: true,
      error: null,
      initialized: false,
      authReady: false,
      isAuthenticated: false,

      // Actions
      setUser: (user) => {
        set({ user, error: null, isAuthenticated: !!user })
      },

      setLoading: (loading) => {
        set({ loading })
      },

      setError: (error) => {
        set({ error, loading: false })
      },

      setInitialized: (initialized) => {
        set({ initialized })
      },

      setAuthReady: (authReady) => {
        set({ authReady })
      },

      updateUser: (updates) => {
        const currentUser = get().user
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates }
          set({ user: updatedUser, isAuthenticated: !!updatedUser })
        }
      },

      clearAuth: () => {
        set({
          user: null,
          loading: false,
          error: null,
          initialized: true,
          authReady: false,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        initialized: state.initialized,
        isAuthenticated: state.isAuthenticated,
        // authReady is intentionally excluded - it should be determined fresh on each app load
      }),
    }
  )
)
