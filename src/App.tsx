import { Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'

import { Layout } from '@/components/common/Layout'
import { ErrorFallback } from '@/components/common/ErrorFallback'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { SmartRoute } from '@/components/common/SmartRoute'
import { HomePage } from '@/screens/HomePage'
import { AuthPage } from '@/screens/AuthPage'
import { AboutPage } from '@/screens/AboutPage'
import { VerifyEmailPage } from '@/screens/VerifyEmailPage'
import { PrivacyPage } from '@/screens/PrivacyPage'
import { TermsPage } from '@/screens/TermsPage'
import { NotFoundPage } from '@/screens/NotFoundPage'
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth'
import { useBalanceBootstrap } from '@/hooks/useBalanceBootstrap'

function App() {
  // Initialize Firebase Auth listener
  useFirebaseAuth()

  // Initialize balance management
  useBalanceBootstrap()

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Layout>
        <Routes>
          {/* Smart root route - shows landing or redirects to app based on auth */}
          <Route path="/" element={<SmartRoute />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* Protected routes */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <HomePage />
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
