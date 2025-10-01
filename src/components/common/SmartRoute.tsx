import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LandingPage } from '@/screens/LandingPage'

/**
 * Smart root route component that handles authentication-based routing
 * - Shows landing page for unauthenticated users
 * - Redirects authenticated users to the main app
 * - Shows loading state while authentication is being determined
 */
export function SmartRoute() {
  const { isAuthenticated, loading, initialized } = useAuth()

  // Show loading while auth is being initialized
  if (!initialized || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect authenticated users to the main app
  if (isAuthenticated) {
    return <Navigate to="/app" replace />
  }

  // Show landing page for unauthenticated users
  return <LandingPage />
}
