import { useBalanceStore } from '@/store/balanceStore'

export const useBalance = () => {
  return useBalanceStore()
}
