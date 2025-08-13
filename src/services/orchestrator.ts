import { ApiService } from './api'
import { useAuthStore } from '@/store/authStore'
import type {
  OrchestratorRequest,
  OrchestratorResponse,
  ChatMessage,
} from '@/types/api'

class OrchestratorService {
  private baseUrl = '/orchestrator'

  /**
   * Send message to orchestrator - user_id now comes from Firebase token
   * The backend will extract user_id from the JWT token automatically
   */
  async sendMessage(
    message: string,
    conversationId?: string
  ): Promise<OrchestratorResponse> {
    // Check if user is authenticated
    const { user, isAuthenticated } = useAuthStore.getState()
    if (!isAuthenticated || !user) {
      throw new Error('User must be authenticated to send messages')
    }

    // Prepare request - no user_id needed as it's in the JWT token
    const request: OrchestratorRequest = {
      query: message.trim(),
      conversation_id: conversationId,
      timestamp: new Date().toISOString(),
      metadata: {
        client_type: 'web',
        user_agent: navigator.userAgent,
        timestamp: Date.now(),
      },
    }

    try {
      const response = await ApiService.post<OrchestratorResponse>(
        `${this.baseUrl}`,
        request
      )

      return response
    } catch (error) {
      console.error('Orchestrator request failed:', error)

      if (error instanceof Error) {
        throw new Error(`Failed to send message: ${error.message}`)
      }

      throw new Error('Failed to send message: Unknown error')
    }
  }

  /**
   * Get conversation history - user_id from token
   */
  async getConversationHistory(
    conversationId: string,
    limit?: number,
    offset?: number
  ): Promise<{ messages: ChatMessage[]; total: number }> {
    const { isAuthenticated } = useAuthStore.getState()
    if (!isAuthenticated) {
      throw new Error(
        'User must be authenticated to access conversation history'
      )
    }

    try {
      const params = new URLSearchParams()
      if (limit) params.append('limit', limit.toString())
      if (offset) params.append('offset', offset.toString())

      const response = await ApiService.get<{
        messages: ChatMessage[]
        total: number
      }>(
        `${this.baseUrl}/conversations/${conversationId}/history?${params.toString()}`
      )

      return response
    } catch (error) {
      console.error('Failed to fetch conversation history:', error)
      throw new Error('Failed to fetch conversation history')
    }
  }

  // Legacy method for backward compatibility - maps to sendMessage
  async sendQuery(
    query: string,
    conversationId: string | null = null
  ): Promise<OrchestratorResponse> {
    return this.sendMessage(query, conversationId || undefined)
  }
}

export const orchestratorService = new OrchestratorService()
