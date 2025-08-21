import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { ConversationState, ChatMessage } from '@/types/api'
import { orchestratorService } from '@/services/orchestrator'
import { useAuthStore } from './authStore'
import { useBalanceStore } from './balanceStore'

interface ConversationStore extends ConversationState {
  // Actions
  sendMessage: (query: string) => Promise<void>
  resetConversation: () => void
  clearError: () => void
  clearConversationsOnLogout: () => void
}

export const useConversationStore = create<ConversationStore>()(
  persist(
    (set, get) => ({
      // Initial state
      id: null,
      messages: [],
      isLoading: false,
      error: null,

      // Actions
      sendMessage: async (query: string) => {
        // Check authentication
        const { isAuthenticated } = useAuthStore.getState()
        if (!isAuthenticated) {
          set({
            error: 'You must be signed in to send messages',
            isLoading: false,
          })
          return
        }

        // Check balance
        const { needsTopUp } = useBalanceStore.getState()
        if (needsTopUp) {
          set({
            error:
              'Your balance is below $0. Please top-up your account to continue sending messages.',
            isLoading: false,
          })
          return
        }

        const state = get()

        // Add user message immediately
        const userMessage: ChatMessage = {
          id: uuidv4(),
          content: query,
          role: 'user',
          timestamp: new Date().toISOString(),
        }

        set({
          messages: [...state.messages, userMessage],
          isLoading: true,
          error: null,
        })

        try {
          // Use new sendMessage method that gets user_id from token
          const assistantMessages = await orchestratorService.sendMessage(
            query,
            state.id || undefined
          )

          // Set conversation ID from the first assistant message
          const conversationId =
            assistantMessages[0]?.conversation_id || state.id

          set({
            id: conversationId,
            messages: [...get().messages, ...assistantMessages],
            isLoading: false,
          })
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      },

      resetConversation: () => {
        try {
          set({
            id: null,
            messages: [],
            isLoading: false,
            error: null,
          })
        } catch (error) {
          console.error('Error resetting conversation:', error)
          set({ error: 'Failed to reset conversation' })
        }
      },

      clearError: () => {
        set({ error: null })
      },

      clearConversationsOnLogout: () => {
        set({
          id: null,
          messages: [],
          isLoading: false,
          error: null,
        })
      },
    }),
    {
      name: 'conversation-store',
      partialize: (state) => ({
        id: state.id,
        messages: state.messages,
      }),
      // Clear conversation store when user changes (different user ID in the storage key)
      getStorage: () => {
        const { user } = useAuthStore.getState()
        const userSpecificKey = user
          ? `conversation-store-${user.uid}`
          : 'conversation-store'

        return {
          getItem: () => localStorage.getItem(userSpecificKey),
          setItem: (_, value) => localStorage.setItem(userSpecificKey, value),
          removeItem: () => localStorage.removeItem(userSpecificKey),
        }
      },
    }
  )
)

// Subscribe to auth changes to clear conversations on logout
useAuthStore.subscribe((state, prevState) => {
  // If user logged out, clear conversations
  if (prevState.user && !state.user) {
    useConversationStore.getState().clearConversationsOnLogout()
  }
})
