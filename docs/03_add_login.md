# Firebase Authentication Implementation Plan (Simplified with FirebaseUI)

## Overview

This document outlines a simplified plan for implementing Firebase Authentication using **FirebaseUI** - a complete drop-in auth solution that handles UI flows, best practices, and edge cases automatically. This approach significantly reduces implementation complexity while maintaining the existing project architecture.

## Current State Analysis

### Existing Infrastructure

- **Framework**: React + TypeScript + Vite
- **State Management**: Zustand (`src/store/conversationStore.ts`)
- **API Layer**: Axios with interceptors (`src/services/api.ts`)
- **Routing**: React Router (`src/App.tsx`)
- **UI Components**: Custom components in `src/components/ui/` and `src/components/common/`
- **Current Auth**: Basic token handling with localStorage ('auth-token')
- **User Management**: Environment-based user ID (`VITE_USER_ID`)

### Current Auth Token Flow

- API service automatically attaches bearer token from localStorage
- 401 responses redirect to '/login' and clear tokens
- Orchestrator service uses environment user ID

## Simplified Implementation Plan with FirebaseUI

### Phase 1: Dependencies and Configuration

#### 1.1 Package Dependencies

**File to modify**: `package.json`

```json
"dependencies": {
  // Add Firebase dependencies
  "firebase": "^10.8.0",
  "firebaseui": "^6.1.0",
  "react-firebaseui": "^6.0.0"
}
```

**Install command**:

```bash
npm install firebase firebaseui react-firebaseui
```

#### 1.2 Environment Configuration

**File to modify**: `.env.example` and `.env`

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Keep existing backend URL variable
# VITE_BACKEND_URL=http://localhost:8080

# Remove or keep for fallback
# VITE_USER_ID=default_user
```

#### 1.3 Firebase Configuration

**New file**: `src/config/firebase.ts`

```typescript
import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Connect to Auth emulator in development
if (import.meta.env.DEV && !auth.emulatorConfig) {
  connectAuthEmulator(auth, 'http://localhost:9099')
}

export default auth
```

### Phase 2: Type Definitions

#### 2.1 Auth Types (Simplified)

**New file**: `src/types/auth.ts`

```typescript
import type { User as FirebaseUser } from 'firebase/auth'

export interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
}

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  initialized: boolean
}

export interface AuthContextType extends AuthState {
  signOut: () => Promise<void>
  refreshToken: () => Promise<string | null>
  updateUserProfile: (updates: Partial<User>) => Promise<void>
}

export type FirebaseAuthError = {
  code: string
  message: string
}

// Convert Firebase User to our User interface
export const mapFirebaseUser = (firebaseUser: FirebaseUser): User => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  displayName: firebaseUser.displayName,
  photoURL: firebaseUser.photoURL,
  emailVerified: firebaseUser.emailVerified,
})
```

#### 2.2 Update Existing Types

**File to modify**: `src/types/api.ts`

```typescript
// Remove user_id from OrchestratorRequest since it will come from JWT token
export interface OrchestratorRequest {
  message: string
  conversation_id?: string
  timestamp: string
  metadata?: {
    client_type: 'web' | 'mobile'
    user_agent?: string
    timestamp: number
    [key: string]: any
  }
  // user_id is now extracted from Firebase JWT token by backend
}

export interface OrchestratorResponse {
  id: string
  content: string
  role: 'assistant'
  timestamp: string
  conversation_id: string
  agent_queries?: Record<string, string>
  metadata?: {
    processing_time?: number
    model_used?: string
    confidence?: number
    [key: string]: any
  }
}

export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
  conversation_id?: string
  agent_queries?: Record<string, string>
  metadata?: Record<string, any>
}

// Auth-related API types
export interface AuthenticatedApiResponse<T = any> {
  data: T
  success: boolean
  message?: string
  timestamp: string
}

export interface UserProfile {
  uid: string
  email: string
  display_name?: string
  photo_url?: string
  created_at: string
  last_login: string
  preferences?: {
    theme?: 'light' | 'dark' | 'auto'
    language?: string
    notifications?: boolean
    [key: string]: any
  }
}

export interface ConversationSummary {
  id: string
  title: string
  last_message: string
  last_updated: string
  message_count: number
  created_at: string
}

// API Error types
export interface ApiErrorResponse {
  error: string
  code?: string
  details?: Record<string, any>
  timestamp: string
}
```

### Phase 3: Authentication Store (Simplified)

#### 3.1 Auth Store

**New file**: `src/store/authStore.ts`

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AuthState } from '@/types/auth'

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setInitialized: (initialized: boolean) => void
  clearAuth: () => void
  updateUser: (updates: Partial<User>) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      loading: true,
      error: null,
      initialized: false,

      // Actions
      setUser: (user) => {
        set({ user, error: null })
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

      updateUser: (updates) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } })
        }
      },

      clearAuth: () => {
        set({
          user: null,
          loading: false,
          error: null,
          initialized: true,
        })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        initialized: state.initialized,
      }),
    }
  )
)
```

#### 3.2 Store Integration

**File to modify**: `src/store/conversationStore.ts`

- Remove hardcoded user ID
- Get user ID from auth store
- Clear conversations on logout

### Phase 4: Firebase Service Layer (Simplified)

#### 4.1 Auth Service (Minimal)

**New file**: `src/services/authService.ts`

```typescript
import {
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth'
import { auth } from '@/config/firebase'
import { useAuthStore } from '@/store/authStore'
import { mapFirebaseUser, type User } from '@/types/auth'

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
            setUser(user)
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
```

#### 4.2 Update API Service

**File to modify**: `src/services/api.ts`

```typescript
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios'
import { authService } from './authService'
import { useAuthStore } from '@/store/authStore'

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000

interface APIError {
  message: string
  code?: string
  status?: number
}

// Enhanced axios instance with Firebase auth integration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token refresh state
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: any) => void
}> = []

// Process queued requests after token refresh
const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token!)
    }
  })
  failedQueue = []
}

// Request interceptor - attach Firebase ID token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await authService.getIdToken()
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
    } catch (error) {
      console.warn('Failed to get auth token:', error)
      // Continue with request without token - backend will handle unauthorized
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle token refresh and auth errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized - token expired or invalid
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            return apiClient(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Attempt to refresh token
        const newToken = await authService.getIdToken(true)

        if (newToken) {
          // Process failed queue
          processQueue(null, newToken)

          // Retry original request with new token
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`
          return apiClient(originalRequest)
        } else {
          throw new Error('No valid token available')
        }
      } catch (refreshError) {
        // Token refresh failed - user needs to sign in again
        processQueue(refreshError, null)

        // Clear auth state
        useAuthStore.getState().clearAuth()

        // Redirect to login if not already on auth page
        if (window.location.pathname !== '/auth') {
          window.location.href = '/auth'
        }

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Handle other HTTP errors
    const apiError: APIError = {
      message: extractErrorMessage(error),
      code: error.code,
      status: error.response?.status,
    }

    return Promise.reject(apiError)
  }
)

// Extract error message helper
const extractErrorMessage = (error: AxiosError): string => {
  if (error.response?.data && typeof error.response.data === 'object') {
    const data = error.response.data as any
    return data.message || data.error || 'Request failed'
  }

  if (error.message) {
    return error.message
  }

  return 'An unexpected error occurred'
}

// API service class with static methods (matches existing pattern)
export class ApiService {
  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.get<T>(url, config)
    return response.data
  }

  static async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await apiClient.post<T>(url, data, config)
    return response.data
  }

  static async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await apiClient.put<T>(url, data, config)
    return response.data
  }

  static async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await apiClient.patch<T>(url, data, config)
    return response.data
  }

  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.delete<T>(url, config)
    return response.data
  }

  // Utility method to get raw axios instance if needed
  static getAxiosInstance(): AxiosInstance {
    return apiClient
  }
}

// Health check utility (unchanged)
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    await ApiService.get('/health')
    return true
  } catch {
    return false
  }
}

export default apiClient

// Type declarations for axios config extension
declare module 'axios' {
  interface AxiosRequestConfig {
    _retry?: boolean
  }
}
```

Now I need to update the orchestrator service to use the static methods:

```typescript:docs/03_add_login.md
#### 4.3 Update Orchestrator Service
**File to modify**: `src/services/orchestrator.ts`
```

```typescript
import { ApiService } from './api'
import { useAuthStore } from '@/store/authStore'
import type {
  OrchestratorRequest,
  OrchestratorResponse,
  ChatMessage,
} from '@/types/api'

class OrchestratorService {
  private baseUrl = '/orchestrator'

  /**
   * Send message to orchestrator - user_id now comes from Firebase token
   * The backend will extract user_id from the JWT token automatically
   */
  async sendMessage(
    message: string,
    conversationId?: string
  ): Promise<OrchestratorResponse> {
    // Check if user is authenticated
    const { user, isAuthenticated } = useAuthStore.getState()
    if (!isAuthenticated || !user) {
      throw new Error('User must be authenticated to send messages')
    }

    // Prepare request - no user_id needed as it's in the JWT token
    const request: Omit<OrchestratorRequest, 'user_id'> = {
      message: message.trim(),
      conversation_id: conversationId,
      timestamp: new Date().toISOString(),
      metadata: {
        client_type: 'web',
        user_agent: navigator.userAgent,
        timestamp: Date.now(),
      },
    }

    try {
      const response = await ApiService.post<OrchestratorResponse>(
        `${this.baseUrl}/chat`,
        request
      )

      return response
    } catch (error) {
      console.error('Orchestrator request failed:', error)

      if (error instanceof Error) {
        throw new Error(`Failed to send message: ${error.message}`)
      }

      throw new Error('Failed to send message: Unknown error')
    }
  }

  /**
   * Get conversation history - user_id from token
   */
  async getConversationHistory(
    conversationId: string,
    limit?: number,
    offset?: number
  ): Promise<{ messages: ChatMessage[]; total: number }> {
    const { isAuthenticated } = useAuthStore.getState()
    if (!isAuthenticated) {
      throw new Error(
        'User must be authenticated to access conversation history'
      )
    }

    try {
      const params = new URLSearchParams()
      if (limit) params.append('limit', limit.toString())
      if (offset) params.append('offset', offset.toString())

      const response = await ApiService.get<{
        messages: ChatMessage[]
        total: number
      }>(
        `${this.baseUrl}/conversations/${conversationId}/history?${params.toString()}`
      )

      return response
    } catch (error) {
      console.error('Failed to fetch conversation history:', error)
      throw new Error('Failed to fetch conversation history')
    }
  }

  // ... rest of methods using ApiService.get(), ApiService.post(), etc.
}

export const orchestratorService = new OrchestratorService()
export default orchestratorService
```

### Phase 5: Authentication Hooks (Simplified)

#### 5.1 Auth Hooks

**New file**: `src/hooks/useAuth.ts`

```typescript
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/authService'
import { useCallback } from 'react'

export function useAuth() {
  const { user, loading, error, initialized, setError, clearAuth } =
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
    isAuthenticated: !!user,

    // Actions
    signOut,
    updateProfile,
    refreshToken,
    clearError: () => setError(null),
  }
}
```

**New file**: `src/hooks/useAuthGuard.ts`

```typescript
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'

export function useAuthGuard(redirectTo: string = '/auth') {
  const { isAuthenticated, initialized } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      // Save the attempted location for redirecting after login
      navigate(redirectTo, {
        state: { from: location.pathname },
        replace: true,
      })
    }
  }, [isAuthenticated, initialized, navigate, redirectTo, location])

  return {
    isAuthenticated,
    isLoading: !initialized,
    canAccess: initialized && isAuthenticated,
  }
}
```

**New file**: `src/hooks/useFirebaseAuth.ts`

```typescript
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
```

### Phase 6: UI Components (Simplified with FirebaseUI)

#### 6.1 FirebaseUI Components

**New file**: `src/components/ui/FirebaseAuthUI.tsx`

```typescript
import React, { useEffect, useRef } from 'react'
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth'
import * as firebaseui from 'firebaseui'
import { auth } from '@/config/firebase'
import 'firebaseui/dist/firebaseui.css'

interface FirebaseAuthUIProps {
  onSignInSuccess?: () => void
  className?: string
}

export function FirebaseAuthUI({ onSignInSuccess, className }: FirebaseAuthUIProps) {
  const uiRef = useRef<firebaseui.auth.AuthUI | null>(null)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize FirebaseUI only once
    if (!uiRef.current) {
      uiRef.current = new firebaseui.auth.AuthUI(auth)
    }

    const uiConfig: firebaseui.auth.Config = {
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          // Handle successful sign-in
          console.log('Sign-in successful:', authResult.user.email)
          onSignInSuccess?.()
          // Return false to avoid redirect
          return false
        },
        uiShown: () => {
          // Hide the loader
          const loader = document.getElementById('firebaseui-auth-loader')
          if (loader) {
            loader.style.display = 'none'
          }
        },
      },
      signInFlow: 'popup', // Use popup for better UX
      signInOptions: [
        // Email/Password
        {
          provider: EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: true,
          signInMethod: EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
        },
        // Google
        {
          provider: GoogleAuthProvider.PROVIDER_ID,
          scopes: ['profile', 'email'],
          customParameters: {
            // Forces account selection even when one account is available
            prompt: 'select_account',
          },
        },
      ],
      tosUrl: '/terms',
      privacyPolicyUrl: '/privacy',
      credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
    }

    // Start the UI
    if (elementRef.current) {
      uiRef.current.start(elementRef.current, uiConfig)
    }

    // Cleanup
    return () => {
      if (uiRef.current) {
        uiRef.current.reset()
      }
    }
  }, [onSignInSuccess])

  return (
    <div className={`firebase-auth-ui ${className || ''}`}>
      <div id="firebaseui-auth-loader" className="text-center py-4">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
      <div ref={elementRef} id="firebaseui-auth-container"></div>
    </div>
  )
}
```

#### 6.2 Auth Components (Minimal)

**New file**: `src/components/ui/UserProfile.tsx`

- User avatar and name display
- Profile editing form
- Password change functionality

**New file**: `src/components/ui/UserMenu.tsx`

- Dropdown menu with user options
- Profile link
- Logout button

#### 6.3 Protection Components

**New file**: `src/components/common/ProtectedRoute.tsx`

```typescript
import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  redirectTo = '/auth'
}: ProtectedRouteProps) {
  const { isAuthenticated, loading, initialized } = useAuth()
  const location = useLocation()

  // Show loading while auth is being initialized
  if (!initialized || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location.pathname }}
        replace
      />
    )
  }

  return <>{children}</>
}
```

**New file**: `src/components/common/AuthGuard.tsx`

- Component wrapper for protected content
- Inline authentication prompts

### Phase 7: Screen Components (Simplified)

#### 7.1 Auth Screens (Single Screen)

**New file**: `src/screens/AuthPage.tsx`

```typescript
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FirebaseAuthUI } from '@/components/ui/FirebaseAuthUI'
import { useAuth } from '@/hooks/useAuth'
import councilImage from '@/assets/council.png'

export function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from || '/'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const handleSignInSuccess = () => {
    const from = location.state?.from || '/'
    navigate(from, { replace: true })
  }

  if (isAuthenticated) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf9f5' }}>
      <div className="flex min-h-screen flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          {/* Logo and title */}
          <div className="text-center">
            <img
              src={councilImage}
              alt="Council of Sages"
              className="mx-auto h-20 w-20 object-contain sm:h-24 sm:w-24"
            />
            <h1 className="mt-4 font-heading text-2xl font-bold text-gray-900 sm:text-3xl">
              Welcome to Council of Sages
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to access your AI-powered advisory council
            </p>
          </div>

          {/* Auth UI */}
          <div className="mt-8">
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <FirebaseAuthUI
                onSignInSuccess={handleSignInSuccess}
                className="w-full"
              />
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-blue-600 hover:text-blue-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
```

**New file**: `src/screens/ProfilePage.tsx`

- User profile management
- Account settings
- Delete account option

#### 7.2 Update Existing Screens

**File to modify**: `src/screens/HomePage.tsx`

- Add authentication check
- Show login prompt for guests
- Display user info when authenticated
- Handle logout functionality

### Phase 8: Navigation and Routing (Simplified)

#### 8.1 Update App Router

**File to modify**: `src/App.tsx`

```typescript
import { Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'

import { Layout } from '@/components/common/Layout'
import { ErrorFallback } from '@/components/common/ErrorFallback'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { HomePage } from '@/screens/HomePage'
import { AuthPage } from '@/screens/AuthPage'
import { ProfilePage } from '@/screens/ProfilePage'
import { AboutPage } from '@/screens/AboutPage'
import { NotFoundPage } from '@/screens/NotFoundPage'
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth'

function App() {
  // Initialize Firebase Auth listener
  useFirebaseAuth()

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  )
}

export default App
```

#### 8.2 Update Layout

**File to modify**: `src/components/common/Layout.tsx`

```typescript
import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Brain, LogIn, User } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { user, isAuthenticated, signOut } = useAuth()

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'About', href: '/about', current: location.pathname === '/about' },
  ]

  // Clean minimal layout for homepage (ChatGPT style)
  if (location.pathname === '/') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#faf9f5' }}>
        <main>{children}</main>
      </div>
    )
  }

  // Full layout for other screens
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <Brain className="h-8 w-8 text-blue-600" />
                <span className="font-heading text-xl font-bold text-gray-900 dark:text-white">
                  Council of Sages
                </span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex min-h-[44px] items-center rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                    item.current
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Auth Section */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                      {user?.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="Profile"
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <User className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {user?.displayName || user?.email}
                    </span>
                  </div>
                  <Link
                    to="/profile"
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={signOut}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md p-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-gray-700"
                aria-expanded={isMenuOpen}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="space-y-1 border-t border-gray-200 px-2 pb-3 pt-2 sm:px-3 dark:border-gray-700">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block flex min-h-[44px] items-center rounded-md px-4 py-4 text-base font-medium transition-colors ${
                      item.current
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Mobile Auth Section */}
                <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
                  {isAuthenticated ? (
                    <div className="space-y-1">
                      <div className="flex items-center px-4 py-2">
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                          {user?.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt="Profile"
                              className="h-8 w-8 rounded-full"
                            />
                          ) : (
                            <User className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {user?.displayName || user?.email}
                        </span>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="block rounded-md px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          signOut()
                          setIsMenuOpen(false)
                        }}
                        className="block w-full text-left rounded-md px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/auth"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700 mx-4"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Sign In</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Council of Sages. Built with
              React, TypeScript, and Tailwind CSS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
```

### Phase 9: Utils and Configuration (Simplified)

#### 9.1 FirebaseUI Configuration

**New file**: `src/config/firebaseUIConfig.ts`

```typescript
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth'
import * as firebaseui from 'firebaseui'

export const getFirebaseUIConfig = (): firebaseui.auth.Config => ({
  callbacks: {
    signInSuccessWithAuthResult: (authResult, redirectUrl) => {
      // User successfully signed in
      console.log('Sign-in successful:', authResult.user.email)
      // Return false to avoid redirect, let React Router handle navigation
      return false
    },
    uiShown: () => {
      // The widget is rendered. Hide the loader
      const loader = document.getElementById('firebaseui-auth-loader')
      if (loader) {
        loader.style.display = 'none'
      }
    },
  },
  // Will use popup for IDP Providers sign-in flow instead of the default redirect
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [
    // Email and password sign-in
    {
      provider: EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: true,
      signInMethod: EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
    },
    // Google sign-in
    {
      provider: GoogleAuthProvider.PROVIDER_ID,
      scopes: ['profile', 'email'],
      customParameters: {
        // Forces account selection even when one account is available
        prompt: 'select_account',
      },
    },
    // Add more providers as needed:
    // FacebookAuthProvider.PROVIDER_ID,
    // TwitterAuthProvider.PROVIDER_ID,
    // PhoneAuthProvider.PROVIDER_ID,
  ],
  // Terms of service url
  tosUrl: '/terms-of-service',
  // Privacy policy url
  privacyPolicyUrl: '/privacy-policy',
  // Credential helper
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
})

// Custom CSS overrides for FirebaseUI
export const firebaseUICustomCSS = `
.firebaseui-container {
  font-family: inherit;
}

.firebaseui-card-content {
  padding: 0;
}

.firebaseui-idp-button {
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  height: 48px;
  font-size: 0.875rem;
  font-weight: 500;
}

.firebaseui-idp-text {
  font-size: 0.875rem;
  font-weight: 500;
}

.firebaseui-textfield {
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.firebaseui-button {
  border-radius: 0.5rem;
  height: 48px;
  font-weight: 500;
}

.firebaseui-form-actions .firebaseui-button {
  background-color: #2563eb;
}

.firebaseui-form-actions .firebaseui-button:hover {
  background-color: #1d4ed8;
}

.firebaseui-link {
  color: #2563eb;
}

.firebaseui-link:hover {
  color: #1d4ed8;
}
`
```

#### 9.2 Auth Utils (Minimal)

**New file**: `src/utils/authUtils.ts`

```typescript
import { FirebaseError } from 'firebase/app'
import type { FirebaseAuthError } from '@/types/auth'

/**
 * Map Firebase Auth error codes to user-friendly messages
 */
export const mapAuthError = (error: FirebaseError): string => {
  const errorMappings: Record<string, string> = {
    // Email/Password errors
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password should be at least 6 characters long.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled.',

    // Network errors
    'auth/network-request-failed':
      'Network error. Please check your connection.',
    'auth/too-many-requests':
      'Too many failed attempts. Please try again later.',

    // Token errors
    'auth/invalid-id-token': 'Your session has expired. Please sign in again.',
    'auth/id-token-expired': 'Your session has expired. Please sign in again.',
    'auth/id-token-revoked':
      'Your session has been revoked. Please sign in again.',

    // Generic errors
    'auth/internal-error': 'An internal error occurred. Please try again.',
    'auth/invalid-api-key': 'Configuration error. Please contact support.',
    'auth/app-deleted': 'Configuration error. Please contact support.',
    'auth/invalid-user-token': 'Your session is invalid. Please sign in again.',
    'auth/user-token-expired':
      'Your session has expired. Please sign in again.',
    'auth/null-user': 'No user is currently signed in.',
    'auth/tenant-id-mismatch': 'Configuration error. Please contact support.',

    // Provider-specific errors
    'auth/account-exists-with-different-credential':
      'An account already exists with the same email but different sign-in credentials.',
    'auth/credential-already-in-use':
      'This credential is already associated with a different account.',
    'auth/popup-closed-by-user': 'Sign-in was cancelled.',
    'auth/popup-blocked':
      'Popup was blocked by your browser. Please allow popups for this site.',
    'auth/cancelled-popup-request':
      'Only one popup request is allowed at a time.',
    'auth/unauthorized-domain': 'This domain is not authorized for sign-in.',
  }

  return (
    errorMappings[error.code] ||
    'An unexpected error occurred. Please try again.'
  )
}

/**
 * Check if a Firebase Auth error is retryable
 */
export const isRetryableAuthError = (error: FirebaseError): boolean => {
  const retryableCodes = [
    'auth/network-request-failed',
    'auth/internal-error',
    'auth/too-many-requests',
  ]

  return retryableCodes.includes(error.code)
}

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 */
export const validatePasswordStrength = (
  password: string
): {
  isValid: boolean
  errors: string[]
} => {
  const errors: string[] = []

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long')
  }

  if (password.length < 8) {
    errors.push('Consider using at least 8 characters for better security')
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password should contain at least one lowercase letter')
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password should contain at least one uppercase letter')
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password should contain at least one number')
  }

  if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?])/.test(password)) {
    errors.push('Password should contain at least one special character')
  }

  return {
    isValid:
      errors.length === 0 ||
      (errors.length === 1 && errors[0].includes('Consider')),
    errors,
  }
}

/**
 * Generate a secure display name from email
 */
export const generateDisplayNameFromEmail = (email: string): string => {
  return email
    .split('@')[0]
    .split(/[._-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

/**
 * Check if we're running in development mode
 */
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV
}

/**
 * Safe JSON parse with fallback
 */
export const safeParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}
```

## Implementation Summary

### Key Benefits of This Approach

1. **Simplified UI**: FirebaseUI handles all authentication flows with minimal code
2. **Production Ready**: Built-in security, validation, and error handling
3. **Mobile Optimized**: Responsive design that works on all devices
4. **Minimal Dependencies**: Only 3 additional packages needed
5. **Type Safe**: Full TypeScript support throughout
6. **Zustand Integration**: Seamless state management with existing architecture

### Implementation Steps

1. **Install Dependencies**: `npm install firebase firebaseui react-firebaseui`
2. **Environment Setup**: Add Firebase config to `.env`
3. **Create Auth Infrastructure**: Services, stores, hooks, and types
4. **Build UI Components**: Single FirebaseUI component + protection components
5. **Update Routing**: Add protected routes and auth page
6. **Integrate API**: Update services to use Firebase tokens
7. **Test**: Verify auth flows work correctly

### Security Considerations

- Firebase handles all security best practices automatically
- ID tokens are automatically refreshed
- HTTPS-only in production
- Built-in protection against common attacks
- Emulator support for development

## Simplified File Structure After Implementation

```
src/
├── components/
│   ├── ui/
│   │   ├── FirebaseAuthUI.tsx          [NEW] - Single auth component
│   │   ├── UserProfile.tsx             [NEW]
│   │   └── UserMenu.tsx                [NEW]
│   └── common/
│       ├── ProtectedRoute.tsx          [NEW]
│       ├── AuthGuard.tsx               [NEW]
│       └── Layout.tsx                  [MODIFIED]
├── screens/
│   ├── AuthPage.tsx                    [NEW] - Single auth page
│   ├── ProfilePage.tsx                 [NEW]
│   └── HomePage.tsx                    [MODIFIED]
├── hooks/
│   ├── useAuth.ts                      [NEW]
│   ├── useAuthGuard.ts                 [NEW]
│   └── useFirebaseAuth.ts              [NEW]
├── services/
│   ├── authService.ts                  [NEW] - Minimal
│   ├── migrationService.ts             [NEW]
│   ├── api.ts                          [MODIFIED]
│   └── orchestrator.ts                 [MODIFIED]
├── store/
│   ├── authStore.ts                    [NEW]
│   └── conversationStore.ts            [MODIFIED]
├── config/
│   ├── firebase.ts                     [NEW]
│   └── firebaseUIConfig.ts             [NEW]
├── types/
│   ├── auth.ts                         [NEW] - Simplified
│   └── api.ts                          [MODIFIED]
├── utils/
│   └── authUtils.ts                    [NEW] - Minimal
├── App.tsx                             [MODIFIED]
└── main.tsx                            [MODIFIED]
```
