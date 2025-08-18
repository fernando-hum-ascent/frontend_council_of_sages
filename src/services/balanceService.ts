import { ApiService } from './api'
import type { Balance } from '@/types/api'

export const balanceService = {
  async getMyBalance(): Promise<Balance> {
    return ApiService.get<Balance>('/users/me/balance')
  },
}
