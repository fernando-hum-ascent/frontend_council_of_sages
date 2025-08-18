import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  redirectTo = '/auth',
}: ProtectedRouteProps) {
  const { isAuthenticated, loading, initialized, user } = useAuth()
  const location = useLocation()

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

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate to={redirectTo} state={{ from: location.pathname }} replace />
    )
  }

  // Redirect to verify-email if authenticated but email not verified
  if (user && !user.emailVerified) {
    return <Navigate to="/verify-email" replace />
  }

  return <>{children}</>
}
