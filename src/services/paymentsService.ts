import { ApiService } from './api'
import type { CreatePaymentIntentResponse } from '@/types/api'

export const paymentsService = {
  async createPaymentIntent(
    amountUsd: number,
    signal?: AbortSignal
  ): Promise<CreatePaymentIntentResponse> {
    // Server validates amount; consider sending a tier key instead
    return ApiService.post<CreatePaymentIntentResponse>(
      '/payments/create-payment-intent',
      {
        amount_usd: amountUsd,
      },
      { signal }
    )
  },
}
