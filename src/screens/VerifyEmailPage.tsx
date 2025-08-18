import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { sendEmailVerification } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/services/authService'
import councilImage from '@/assets/council.png'

export function VerifyEmailPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, signOut } = useAuth()
  const [isResending, setIsResending] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [resendMessage, setResendMessage] = useState('')

  // Watch for user emailVerified changes and auto-redirect
  useEffect(() => {
    if (user?.emailVerified) {
      navigate('/', { replace: true })
    }
  }, [user?.emailVerified, navigate])

  // Automatically check verification status when component mounts
  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (!auth.currentUser) return

      try {
        // Use authService to reload and update both Firebase and Zustand store
        await authService.reloadCurrentUser()
      } catch (error) {
        console.error('Failed to auto-check verification:', error)
      }
    }

    // Check immediately on mount, with extra trigger if verified=1 parameter
    const isFromVerificationEmail = searchParams.get('verified') === '1'
    if (isFromVerificationEmail) {
      // Small delay to ensure auth state has settled after redirect
      setTimeout(checkVerificationStatus, 500)
    } else {
      checkVerificationStatus()
    }
  }, [searchParams])

  const handleResendEmail = async () => {
    if (!auth.currentUser) return

    setIsResending(true)
    setResendMessage('')

    try {
      await sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/verify-email?verified=1`,
        handleCodeInApp: false,
      })
      setResendMessage('Verification email sent! Please check your inbox.')
    } catch (error) {
      console.error('Failed to resend verification email:', error)
      setResendMessage('Failed to send email. Please try again later.')
    } finally {
      setIsResending(false)
    }
  }

  const handleCheckVerification = async () => {
    if (!auth.currentUser) return

    setIsChecking(true)

    try {
      // Use authService to reload and update both Firebase and Zustand store
      await authService.reloadCurrentUser()

      // The useEffect watching user.emailVerified will handle the redirect
      // Just show a message if still not verified
      setTimeout(() => {
        if (!user?.emailVerified) {
          setResendMessage(
            'Email not yet verified. Please check your inbox and click the verification link.'
          )
        }
      }, 100)
    } catch (error) {
      console.error('Failed to check verification:', error)
      setResendMessage('Failed to check verification status. Please try again.')
    } finally {
      setIsChecking(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/auth', { replace: true })
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
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
              Verify Your Email
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              We've sent a verification email to:
            </p>
            <p className="mt-1 font-medium text-gray-900">{user?.email}</p>
          </div>

          {/* Instructions */}
          <div className="mt-8 rounded-lg bg-blue-50 p-4">
            <div className="text-sm text-blue-800">
              <h3 className="font-medium">Please check your email</h3>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Look for an email from Firebase Auth</li>
                <li>Click the verification link in the email</li>
                <li>Return here and click "I've verified" below</li>
              </ul>
            </div>
          </div>

          {/* Message */}
          {resendMessage && (
            <div
              className={`mt-4 rounded-lg p-4 ${
                resendMessage.includes('Failed') ||
                resendMessage.includes('not yet')
                  ? 'bg-red-50 text-red-800'
                  : 'bg-green-50 text-green-800'
              }`}
            >
              <p className="text-sm">{resendMessage}</p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 space-y-4">
            <button
              onClick={handleCheckVerification}
              disabled={isChecking}
              className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isChecking ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  Checking...
                </>
              ) : (
                "I've verified my email"
              )}
            </button>

            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isResending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-gray-600"></div>
                  Sending...
                </>
              ) : (
                'Resend verification email'
              )}
            </button>

            <button
              onClick={handleSignOut}
              className="flex w-full justify-center rounded-md border border-transparent bg-transparent px-4 py-3 text-sm font-medium text-gray-600 shadow-sm hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
