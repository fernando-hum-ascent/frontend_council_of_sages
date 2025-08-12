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
