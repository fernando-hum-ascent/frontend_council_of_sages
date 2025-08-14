import { useEffect, useRef } from 'react'
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth'
import * as firebaseui from 'firebaseui'
import { auth } from '@/config/firebase'
import 'firebaseui/dist/firebaseui.css'

interface FirebaseAuthUIProps {
  className?: string
}

export function FirebaseAuthUI({ className }: FirebaseAuthUIProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get or create FirebaseUI instance
    const ui =
      firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth)

    const uiConfig: firebaseui.auth.Config = {
      callbacks: {
        signInSuccessWithAuthResult: () => {
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
        // Email/Password - let FirebaseUI handle sign-in vs sign-up routing
        {
          provider: EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: false,
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

    // Start the UI if element is available
    if (elementRef.current) {
      try {
        // Check if UI is already rendered to avoid double rendering
        if (
          !elementRef.current.hasChildNodes() ||
          elementRef.current.children.length === 0
        ) {
          ui.start(elementRef.current, uiConfig)
        }
      } catch (error) {
        console.error('Error starting FirebaseUI:', error)
        // If there's an error, try to reset and restart
        ui.reset()
        setTimeout(() => {
          if (elementRef.current) {
            ui.start(elementRef.current, uiConfig)
          }
        }, 100)
      }
    }

    // Cleanup function
    return () => {
      try {
        // Reset the UI but don't delete the instance
        ui.reset()
      } catch (error) {
        console.warn('Error during FirebaseUI cleanup:', error)
      }
    }
  }, [])

  return (
    <div className={`firebase-auth-ui ${className || ''}`}>
      <style>{`
        .firebase-auth-ui .firebaseui-container {
          background-color: transparent !important;
          box-shadow: none !important;
          max-width: none !important;
        }
        .firebase-auth-ui .firebaseui-card-content {
          background-color: transparent !important;
          box-shadow: none !important;
        }
        .firebase-auth-ui .firebaseui-form-container {
          background-color: transparent !important;
          box-shadow: none !important;
        }
        .firebase-auth-ui .firebaseui-idp-list {
          margin-bottom: 2rem !important;
        }
        .firebase-auth-ui .firebaseui-idp-password .firebaseui-idp-button,
        .firebase-auth-ui .firebaseui-idp-button[data-provider-id="password"],
        .firebase-auth-ui button[data-provider-id="password"],
        .firebase-auth-ui .mdl-button--colored {
          background-color: #396362 !important;
          border: 1px solid #396362 !important;
        }
        .firebase-auth-ui .firebaseui-idp-password .firebaseui-idp-button:hover,
        .firebase-auth-ui .firebaseui-idp-button[data-provider-id="password"]:hover,
        .firebase-auth-ui button[data-provider-id="password"]:hover,
        .firebase-auth-ui .mdl-button--colored:hover {
          background-color: #2d4f4e !important;
          border: 1px solid #2d4f4e !important;
        }
      `}</style>
      <div id="firebaseui-auth-loader" className="py-4 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
      <div ref={elementRef} id="firebaseui-auth-container"></div>
    </div>
  )
}
