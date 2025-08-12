import { Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'

import { Layout } from '@/components/common/Layout'
import { ErrorFallback } from '@/components/common/ErrorFallback'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { HomePage } from '@/screens/HomePage'
import { AuthPage } from '@/screens/AuthPage'
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

          {/* Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  )
}

export default App
