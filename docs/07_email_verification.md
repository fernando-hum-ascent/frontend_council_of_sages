## Email verification plan (Built-in verification email + gating on `emailVerified`)

Project-specific plan

- Objective: After sign-up, send Firebase's built-in verification email and restrict access until `user.emailVerified` is true. Keep existing Email/Password + Google sign-in.

- Files to modify or add
  - `src/components/ui/FirebaseAuthUI.tsx`
    - In `callbacks.signInSuccessWithAuthResult(authResult)`, when `authResult.additionalUserInfo?.isNewUser` and the provider is Email/Password, call `sendEmailVerification(auth.currentUser, actionCodeSettings?)`.
    - Return `false` and do not navigate here; routing is handled by `AuthPage` and `ProtectedRoute`.
    - Keep Google (and other social) providers as-is; most are already verified and should bypass verification gating via `emailVerified` already being true.
  - `src/screens/AuthPage.tsx`
    - After sign-in (once `isAuthenticated` is true), if `user && !user.emailVerified`, navigate to `/verify-email`; otherwise proceed to the intended route (existing logic).
  - `src/components/common/ProtectedRoute.tsx`
    - If the user is authenticated but `!user.emailVerified`, block protected routes and redirect to `/verify-email`.
    - Public routes like `/auth` and `/verify-email` remain outside `ProtectedRoute`, avoiding redirect loops.
  - `src/screens/VerifyEmailPage.tsx` (new)
    - Page that shows the signed-in email and instructions to check their inbox.
    - Buttons:
      - "Resend verification email" → calls `sendEmailVerification`.
      - "I've verified" → calls `auth.currentUser.reload()`; if now verified, navigate to `/`.
      - "Sign out" → optional convenience.
  - `src/services/authService.ts` (optional)
    - Helpers:
      - `sendVerificationEmail(actionCodeSettings?)`
      - `reloadCurrentUser()`
      - `isEmailVerified(user)`
  - `src/App.tsx`
    - Add route: `/verify-email` → `VerifyEmailPage`.
    - Ensure protected areas are behind `ProtectedRoute` which also checks `user.emailVerified`.
  - `src/hooks/useAuth.ts` or `src/hooks/useAuthGuard.ts`
    - `user.emailVerified` is already exposed via `useAuth()`. Optionally expose a `reloadUser` helper if preferred; otherwise call Firebase `auth.currentUser.reload()` directly in the page.

- Console/env setup
  - Enable Email/Password sign-in in Firebase Console. Social providers can remain enabled.
  - Optional `ActionCodeSettings` to improve UX when user clicks the verification link:
    - `url: ${window.location.origin}/auth?verified=1`
    - `handleCodeInApp: false` (no dynamic links required)

- UX/flow details
  - New Email/Password user
    1. After account creation, send verification email.
    2. Redirect to `/verify-email` with messaging to check their inbox.
    3. When the user completes the link, they return to the app; on `/verify-email`, clicking "I've verified" triggers `reload()` and proceeds once `emailVerified` becomes true.
  - Returning verified user
    - Signs in normally and bypasses `/verify-email`.
  - Social sign-ins (e.g., Google)
    - Typically already verified; proceed without gating.
  - Resend behavior
    - Provide feedback and basic throttling/error handling when resending verification.

- Acceptance checks
  - New user receives a verification email immediately after sign-up.
  - Unverified users cannot access protected routes; they are redirected to `/verify-email`.
  - "Resend verification" sends successfully and handles errors (quota, network).
  - "I've verified" reloads the user and allows entry once `emailVerified` is true.
  - Verified users and social sign-ins are not blocked.

- Removed from scope (compared to prior plan)
  - Email Link sign-in flow, `/auth/email-link`, `/set-password`, and password linking via `linkWithCredential`.

- Example snippets

```ts
// Sending the verification email (Web)
import { sendEmailVerification } from 'firebase/auth'

await sendEmailVerification(auth.currentUser!, {
  // Optional return URL for better UX after verification
  url: `${window.location.origin}/auth?verified=1`,
  handleCodeInApp: false,
})
```

```ts
// Guarding access (conceptual)
if (user && !user.emailVerified) {
  navigate('/verify-email')
  return null
}
```
