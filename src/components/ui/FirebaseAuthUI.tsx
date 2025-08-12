import React, { useEffect, useRef } from 'react'
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
        signInSuccessWithAuthResult: (authResult) => {
          // Handle successful sign-in
          console.log('Sign-in successful:', authResult.user.email)
          // Return false to avoid redirect - let AuthPage handle navigation
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
      <div id="firebaseui-auth-loader" className="py-4 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
      <div ref={elementRef} id="firebaseui-auth-container"></div>
    </div>
  )
}
