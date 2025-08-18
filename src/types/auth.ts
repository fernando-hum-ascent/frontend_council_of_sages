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
  authReady: boolean
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
