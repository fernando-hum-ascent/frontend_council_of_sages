import { useState, useEffect, useMemo } from 'react'
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

function TopUpForm({ onClose }: { onClose: () => void }) {
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
      const result = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: window.location.href,
        },
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
    <div className="space-y-4">
      <div className="payment-element-container">
        <PaymentElement
          options={{
            defaultValues: {
              billingDetails: {
                address: {
                  country: 'US',
                },
              },
            },
          }}
        />
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <button
        disabled={!stripe || submitting}
        onClick={handlePay}
        className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {submitting ? 'Processing…' : 'Complete Payment'}
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
  const [inputValue, setInputValue] = useState<string>('10')
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [creatingIntent, setCreatingIntent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  // Create PaymentIntent when dialog opens or amount changes (only if valid)
  useEffect(() => {
    if (!open) return

    const validation = validateAmount(amountUsd)
    if (validation) {
      setClientSecret(null)
      return
    }

    const createPaymentIntent = async () => {
      setCreatingIntent(true)
      setError(null)
      setClientSecret(null)

      try {
        const { client_secret } =
          await paymentsService.createPaymentIntent(amountUsd)
        setClientSecret(client_secret)
      } catch (e) {
        setError(
          e instanceof Error ? e.message : 'Failed to initialize payment'
        )
      } finally {
        setCreatingIntent(false)
      }
    }

    createPaymentIntent()
  }, [open, amountUsd])

  const options = useMemo(() => {
    if (!clientSecret) return null
    return {
      clientSecret,
      appearance: { theme: 'stripe' as const },
    }
  }, [clientSecret])

  const validateAmount = (amount: number): string | null => {
    if (amount < 3) return 'Minimum amount is $3'
    if (amount > 100) return 'Maximum amount is $100'
    return null
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)

    if (value === '') {
      setValidationError('Amount is required')
      return
    }

    const numericValue = Number(value)
    if (isNaN(numericValue)) {
      setValidationError('Please enter a valid number')
      return
    }

    const validation = validateAmount(numericValue)
    setValidationError(validation)
    setAmountUsd(numericValue)
  }

  const handleClose = () => {
    setClientSecret(null)
    setError(null)
    setValidationError(null)
    setInputValue('10')
    setAmountUsd(10)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="sticky top-0 border-b border-gray-100 bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Add credits</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <label
              htmlFor="amount-input"
              className="block text-sm font-medium text-gray-700"
            >
              Amount to add
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                id="amount-input"
                type="number"
                min="3"
                max="100"
                step="1"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                disabled={creatingIntent}
                className={`w-full rounded-md border py-2 pl-8 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                  validationError
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Enter amount"
              />
            </div>
            <div className="text-xs text-gray-500">Min: $3 • Max: $100</div>
            {validationError && (
              <div className="text-sm text-red-600">{validationError}</div>
            )}
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {creatingIntent && (
            <div className="flex items-center justify-center py-8 text-sm text-gray-500">
              <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
              Preparing payment for ${amountUsd}...
            </div>
          )}

          {!creatingIntent && options && (
            <Elements stripe={stripePromise} options={options}>
              <TopUpForm onClose={handleClose} />
            </Elements>
          )}
        </div>
      </div>
    </div>
  )
}
