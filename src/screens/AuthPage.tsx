import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FirebaseAuthUI } from '@/components/ui/FirebaseAuthUI'
import { useAuth } from '@/hooks/useAuth'
import councilImage from '@/assets/council.png'

export function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, initialized } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && initialized) {
      const fromState = (location.state as { from?: string } | null)?.from
      const candidate =
        typeof fromState === 'string' ? fromState.trim() : undefined
      // Allow only internal paths (no scheme, no protocol-relative)
      const from =
        candidate && candidate.startsWith('/') && !candidate.startsWith('//')
          ? candidate
          : '/'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, initialized, navigate, location.state])

  // Show loading state while redirecting
  if (isAuthenticated) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#faf9f5' }}>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Redirecting...</p>
          </div>
        </div>
      </div>
    )
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
              className="mx-auto h-32 w-32 object-contain sm:h-40 sm:w-40 lg:h-48 lg:w-48"
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
            <FirebaseAuthUI className="w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
