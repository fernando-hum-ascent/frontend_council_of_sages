import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { ConversationState, ChatMessage } from '@/types/api'
import { orchestratorService } from '@/services/orchestrator'

interface ConversationStore extends ConversationState {
  // Actions
  sendMessage: (query: string) => Promise<void>
  resetConversation: () => void
  clearError: () => void
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
        const state = get()

        // Add user message immediately
        const userMessage: ChatMessage = {
          id: uuidv4(),
          content: query,
          role: 'user',
          timestamp: new Date(),
        }

        set({
          messages: [...state.messages, userMessage],
          isLoading: true,
          error: null,
        })

        try {
          const response = await orchestratorService.sendQuery(query, state.id)

          // Add assistant response
          const assistantMessage: ChatMessage = {
            id: uuidv4(),
            content: response.response,
            role: 'assistant',
            timestamp: new Date(),
            agentQueries: response.agent_queries,
            agentResponses: response.agent_responses,
          }

          set({
            id: response.conversation_id,
            messages: [...get().messages, assistantMessage],
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
    }),
    {
      name: 'conversation-store',
      partialize: (state) => ({
        id: state.id,
        messages: state.messages,
      }),
    }
  )
)
