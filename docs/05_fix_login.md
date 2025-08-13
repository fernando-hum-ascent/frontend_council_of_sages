### Fix Login: Ensure existing users go to Sign-in (password) instead of Sign-up

- **Problem**: Existing users entering their email are incorrectly routed to the sign-up flow (name + choose password) instead of the sign-in flow (password + reset option).
- **Goal**: When a known email is entered, show password-only sign-in (with "Forgot password?"). Only unknown emails should proceed to the sign-up flow.
- **Constraint**: Use FirebaseUI when possible.

---

## Approach A (Preferred): Use FirebaseUI to manage email/password flows

FirebaseUI already handles sign-in vs sign-up decisions correctly and avoids most edge cases.

1. Console configuration

- **Enable** Email/Password in Firebase Console → Authentication → Sign-in method.
- Optional: enable **Email link (passwordless)** if we need that path later.

2. Dependencies and assets

- Install and import FirebaseUI and its CSS.

```bash
npm i firebaseui
```

```ts
// If the app uses Firebase v9 modular SDK, keep the compat layer for FirebaseUI
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
```

3. Instantiate and render the UI

- Render the widget where our current custom email form is shown. Let FirebaseUI own the flow.

```ts
// Example skeleton (TypeScript/React pseudo)
const ui =
  firebaseui.auth.AuthUI.getInstance() ||
  new firebaseui.auth.AuthUI(firebase.auth())
const uiConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID, // Email + Password
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => {
      // redirect to app home/dashboard
      window.location.assign('/')
      return false // prevent default redirect
    },
  },
}

// On mount
ui.start('#firebaseui-auth-container', uiConfig)

// On unmount
ui.reset()
```

- If using email link auth later, conditionally start the UI when pending redirect:

```ts
if (
  ui.isPendingRedirect() ||
  firebase.auth().isSignInWithEmailLink(window.location.href)
) {
  ui.start('#firebaseui-auth-container', uiConfig)
}
```

4. Remove custom pre-routing

- Do not manually route to sign-up based on a naive heuristic. Let FirebaseUI decide the correct path.

5. Password reset is built-in

- FirebaseUI renders "Forgot password?" on the password screen; no extra wiring needed.

6. Security

- Consider enabling **Email Enumeration Protection** via gcloud to avoid leaking which emails exist. This changes error messaging to more generic responses.

---

## Approach B (Fallback): Keep custom UI but decide correctly using fetchSignInMethodsForEmail

If we must keep a custom stepper, gate the decision on Firebase’s canonical check.

1. On email submit, query sign-in methods

```ts
import { getAuth, fetchSignInMethodsForEmail } from 'firebase/auth'

const auth = getAuth()
const methods = await fetchSignInMethodsForEmail(auth, email)

if (methods.includes('password')) {
  // Known account with password → show password-only sign-in form
  routeTo('/auth/password')
} else if (methods.length === 0) {
  // New email → proceed to sign-up (collect name, set password)
  routeTo('/auth/sign-up')
} else if (methods.includes('emailLink')) {
  // Known account but passwordless → offer email link flow UI
  routeTo('/auth/email-link')
} else {
  // Other IdPs → show provider chooser (Google/GitHub/etc.)
  routeTo('/auth/providers')
}
```

2. Password-only sign-in screen

- Render email (read-only) + password + "Forgot password?".
- Use `signInWithEmailAndPassword` for submit.

3. Forgot password

- Trigger `sendPasswordResetEmail` for the entered email.

4. Optional email link

- When sending the link, store the email in `localStorage` for same-device completion.
- On return, use `isSignInWithEmailLink` and `signInWithEmailLink(email, link)`.
- Do not include the user email in URL parameters.

5. Security

- If we enable Email Enumeration Protection, ensure UI shows generic, non-revealing errors and still follows the above routing logic (guard UI copy).

---

## UX and Routing Changes

- Replace the current custom email-capture route with either:
  - A FirebaseUI container (`#firebaseui-auth-container`), or
  - A custom form that calls `fetchSignInMethodsForEmail` to branch.
- Ensure a dedicated password screen exists for known emails (no name/registration fields).
- Ensure a clear password reset path from the password screen.

---

## Test Plan

Manual scenarios (staging):

- **Existing user (password)**: Enter existing email → sees password prompt only → correct sign-in; "Forgot password" sends email.
- **New user**: Enter new email → sees sign-up flow (collect name + password) → account created → sign-in.
- **Existing user (email link, if enabled)**: Enter email → offered email link flow → link completes sign-in on same device; cross-device works when email entered manually on completion.
- **Wrong password**: Shows generic error; does not route to sign-up.
- **Enumeration protection enabled**: Error messages remain generic; flows still correct.
- **Refresh and deep-link**: UI correctly resumes pending redirect (`ui.isPendingRedirect`) and handles current URL.

---

## Rollout

- Behind a feature flag `auth.useFirebaseUI`.
- Deploy to staging → QA the scenarios above → enable for a small % of production users → full rollout.
- Keep the old flow behind the flag for quick rollback.

---

## Acceptance Criteria

- Known emails never see the sign-up form; they see password-only with reset option.
- Unknown emails go to sign-up.
- No leakage of account existence via UI copy when enumeration protection is on.
- All tests above pass in staging.
