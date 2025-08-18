import { create } from 'zustand'
import type { Balance } from '@/types/api'
import { balanceService } from '@/services/balanceService'
import { authService } from '@/services/authService'

interface BalanceStore {
  balance: Balance | null
  loading: boolean
  error: string | null
  lastFetchedAt: number | null
  needsTopUp: boolean
  setBalance: (balance: Balance) => void
  fetchBalance: () => Promise<void>
  setError: (error: string | null) => void
  clear: () => void
}

const FETCH_THROTTLE_MS = 15000

export const useBalanceStore = create<BalanceStore>((set, get) => ({
  // Initial state
  balance: null,
  loading: false,
  error: null,
  lastFetchedAt: null,
  needsTopUp: false,

  // Actions
  setBalance: (balance) => {
    set({
      balance,
      error: null,
      loading: false,
      lastFetchedAt: Date.now(),
      needsTopUp: balance.balance_cents < 0,
    })
  },

  fetchBalance: async () => {
    const state = get()
    const now = Date.now()

    // Throttle: skip if fetched recently
    if (state.lastFetchedAt && now - state.lastFetchedAt < FETCH_THROTTLE_MS) {
      return
    }

    // Check if auth is ready before making the request
    if (!authService.isAuthReady()) {
      console.warn('fetchBalance: Auth not ready, skipping balance fetch')
      return
    }

    set({ loading: true, error: null })

    try {
      const balance = await balanceService.getMyBalance()
      get().setBalance(balance)
    } catch (error) {
      // Handle 401s gracefully - user might be unauthenticated
      if (
        error &&
        typeof error === 'object' &&
        'status' in error &&
        error.status === 401
      ) {
        console.warn('fetchBalance: Received 401, clearing balance')
        set({ balance: null, loading: false, error: null })
        return
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch balance'
      console.error('fetchBalance error:', errorMessage)
      set({ error: errorMessage, loading: false })
    }
  },

  setError: (error) => {
    set({ error, loading: false })
  },

  clear: () => {
    set({
      balance: null,
      loading: false,
      error: null,
      lastFetchedAt: null,
      needsTopUp: false,
    })
  },
}))
