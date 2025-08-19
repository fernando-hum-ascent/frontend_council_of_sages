### Add Stripe one‑time payments to replenish user credits

- **Goal**: Allow authenticated users to top up their account balance (credits) with a one‑time card payment. On success, the backend adjusts the user balance and the frontend reflects it via the existing balance flow.
- **Current state (frontend)**:
  - Balance types and store already exist: `src/types/api.ts` → `Balance`, `src/store/balanceStore.ts` with `setBalance`, `fetchBalance`, and `needsTopUp`.
  - Balance is shown in the sidebar (`src/components/ui/Sidebar.tsx`) and updated by orchestrator responses and `useBalanceBootstrap()`.
  - API wrapper: `src/services/api.ts` (auth via Firebase ID token).

---

### Architecture overview

1. Frontend requests a PaymentIntent from the backend with a selected top‑up amount.
2. Backend creates a Stripe PaymentIntent and returns `client_secret` to the frontend.
3. Frontend collects card details and confirms the payment with `stripe.confirmPayment`.
4. Stripe may require 3D Secure (handled in the browser by Stripe).
5. Stripe sends a webhook to the backend on finalization (`payment_intent.succeeded` / `payment_intent.payment_failed`).
6. Backend updates the user balance and persists payment records (idempotent).
7. Frontend refreshes balance (optimistic message + refetch via `fetchBalance`).

This mirrors Stripe’s recommended Payment Intents flow. See: [React Stripe](https://stripe.com/docs/elements/quickstart?platform=web&client=react), [Payment Intents](https://stripe.com/docs/payments/payment-intents/overview), [Webhooks](https://stripe.com/docs/webhooks/quickstart).

---

### Backend requirements (FastAPI)

Add authenticated endpoints and webhook (paths are suggestions; adapt to your backend):

- `POST /payments/create-payment-intent`
  - Body: `{ amount_usd: number }` .
  - Server creates a PaymentIntent: `stripe.PaymentIntent.create(amount=<amount_in_cents>, currency='usd', automatic_payment_methods={'enabled': True}, metadata={'user_id': <from JWT>})`.
  - Returns: `{ client_secret, intent_id, amount, currency, status }`.

- `POST /stripe/webhook` (no auth; verified by `STRIPE_WEBHOOK_SECRET`)
  - On `payment_intent.succeeded`: credit the authenticated user from `event.data.object.metadata.user_id` by the `amount_received`.
  - On `payment_intent.payment_failed`: record failure for visibility.
  - Idempotent updates (store Stripe `event.id` / `intent.id`).

- Data model
  - Persist a `payments` table with: `id`, `stripe_intent_id`, `user_id`, `amount_cents`, `currency`, `status`, `created_at`, `updated_at`.
  - Balance source of truth remains in your user/balance table; webhook mutates it.

- Security
  - Derive `user_id` from Firebase JWT on the server, not from the client.
  - Validate amounts server‑side (only allow predefined tiers or trusted `price_id`).

Env vars (backend):

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

---

### Frontend changes

#### 1) Dependencies and env

Install Stripe packages:

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

Add publishable key to `.env` (and Render/Railway env):

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

#### 2) API types

Extend `src/types/api.ts` with a response type for the create intent request:

```ts
export interface CreatePaymentIntentResponse {
  client_secret: string
  intent_id: string
  amount: number
  currency: string
  status:
    | 'requires_payment_method'
    | 'requires_confirmation'
    | 'requires_action'
    | 'processing'
    | 'succeeded'
    | 'canceled'
}
```

#### 3) Payment service

Create `src/services/paymentsService.ts`:

```ts
import { ApiService } from './api'
import type { CreatePaymentIntentResponse } from '@/types/api'

export const paymentsService = {
  async createPaymentIntent(
    amountUsd: number
  ): Promise<CreatePaymentIntentResponse> {
    // Server validates amount; consider sending a tier key instead
    return ApiService.post<CreatePaymentIntentResponse>(
      '/payments/create-payment-intent',
      {
        amount_usd: amountUsd,
      }
    )
  },
}
```

#### 4) UI: Top‑up modal with Stripe Elements

- Placement: add a "Top up" button inside the Balance section of `src/components/ui/Sidebar.tsx` (visible always, and emphasized when `needsTopUp`).
- Create `src/components/ui/TopUpDialog.tsx` that renders a modal with:
  - Amount presets: $5, $10, $20, $50 (radio or segmented control).
  - Stripe Elements `PaymentElement` or `CardElement`.
  - Pay button that calls `stripe.confirmPayment` using the `client_secret` from the backend.
  - Result handling: show success or error; on success trigger `fetchBalance()`.

Example skeleton (React Stripe Elements):

```tsx
// src/components/ui/TopUpDialog.tsx
import { useState, useMemo } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { paymentsService } from '@/services/paymentsService'
import { useBalance } from '@/hooks/useBalance'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!)

function TopUpForm({
  amountUsd,
  onClose,
}: {
  amountUsd: number
  onClose: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const { fetchBalance } = useBalance()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePay = async () => {
    if (!stripe || !elements) return
    setSubmitting(true)
    setError(null)

    try {
      const { client_secret } =
        await paymentsService.createPaymentIntent(amountUsd)
      const result = await stripe.confirmPayment({
        clientSecret: client_secret,
        elements,
        redirect: 'if_required',
      })

      if (result.error) {
        setError(result.error.message || 'Payment failed')
      } else if (result.paymentIntent) {
        // Tentative result; final confirmation comes via webhook
        // Provide immediate UX feedback and refresh balance shortly
        setTimeout(() => fetchBalance(), 1500)
        onClose()
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PaymentElement />
      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
      <button
        disabled={!stripe || submitting}
        onClick={handlePay}
        className="mt-3 w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {submitting ? 'Processing…' : `Pay $${amountUsd.toFixed(2)}`}
      </button>
    </div>
  )
}

export function TopUpDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [amountUsd, setAmountUsd] = useState<number>(10)
  const options = useMemo(
    () => ({
      appearance: { theme: 'stripe' as const },
    }),
    []
  )

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-4 shadow">
        <h3 className="mb-3 text-lg font-medium">Add credits</h3>
        <div className="mb-3 grid grid-cols-4 gap-2 text-sm">
          {[5, 10, 20, 50].map((v) => (
            <button
              key={v}
              className={`rounded border px-2 py-1 ${amountUsd === v ? 'bg-gray-900 text-white' : ''}`}
              onClick={() => setAmountUsd(v)}
            >
              ${v}
            </button>
          ))}
        </div>
        <Elements stripe={stripePromise} options={options}>
          <TopUpForm amountUsd={amountUsd} onClose={onClose} />
        </Elements>
      </div>
    </div>
  )
}
```

Add a trigger button in `Sidebar.tsx` under the Balance block (style to match):

```tsx
// Inside the Balance section
<button onClick={() => setTopUpOpen(true)} className="mt-2 w-full rounded-md bg-gray-900 px-3 py-2 text-sm text-white hover:opacity-90">
  Add credits
  {needsTopUp ? ' (required)' : ''}
 </button>
<TopUpDialog open={topUpOpen} onClose={() => setTopUpOpen(false)} />
```

Notes:

- The `PaymentElement` requires the PaymentIntent to be created before rendering if using certain payment method types. For a simpler flow, you can render the element after creating the intent, or switch to `CardElement` which does not require a pre‑created intent. The example above creates the intent on button click then confirms immediately; that works because we don’t render `PaymentElement` fields that depend on the intent configuration.
- For the simplest UX, you may opt for `CardElement` and call `stripe.confirmCardPayment(client_secret, { payment_method: { card } })`.

#### 5) Balance refresh and UX

- After a tentative success, call `fetchBalance()` with a short delay (1–2s). The authoritative update will arrive via the webhook updating the backend balance.
- If balance is still unchanged after a few seconds, show a tooltip with “Processing payment… this can take a moment.” Optionally add a lightweight polling loop for ~10s.

---

### Edge cases and error handling

- 3D Secure: `stripe.confirmPayment` with `redirect: 'if_required'` will automatically handle the modal challenge.
- Failures: display `result.error.message`; do not decrement balance on client.
- Cancellations/timeouts: allow retry; the backend should cancel stale PaymentIntents via cron or rely on Stripe auto‑cancellation.
- Idempotency: backend should upsert by `stripe_intent_id` and keep a processed events registry by `event.id`.

---

### Security and compliance

- Never expose `STRIPE_SECRET_KEY` to the client. The client only uses `VITE_STRIPE_PUBLISHABLE_KEY`.
- Validate the amount server‑side; prefer a `tier` enum to eliminate tampering.
- Verify webhooks with the official signature header and `STRIPE_WEBHOOK_SECRET`.
- Store minimal PII; rely on Stripe for card data and PCI compliance.

---

### QA checklist

- [ ] Can select a top‑up amount and complete payment with test card.
- [ ] 3DS flow works with a test card requiring authentication.
- [ ] Webhook updates user balance; `Sidebar` refresh shows new balance within a few seconds.
- [ ] Failed payment shows a user‑friendly error and no balance change.
- [ ] Reloading the page after success still shows the updated balance (persisted server‑side).
- [ ] Amount and currency are correct in Stripe Dashboard.

---

### Rollout plan

1. Implement backend endpoints and webhook in dev; test via Stripe CLI.
2. Implement frontend service and UI; guard UI behind auth (already enforced by API layer).
3. Manual QA with test cards; verify balances and idempotence.
4. Deploy backend with secrets, then frontend with `VITE_STRIPE_PUBLISHABLE_KEY`.
5. Switch Stripe keys to live for production after end‑to‑end verification.

---

### References

- React Stripe Elements: [Quickstart](https://stripe.com/docs/elements/quickstart?platform=web&client=react)
- Payment Intents: [Overview](https://stripe.com/docs/payments/payment-intents/overview)
- Webhooks: [Quickstart](https://stripe.com/docs/webhooks/quickstart)
- Test Cards: [Docs](https://stripe.com/docs/testing)
