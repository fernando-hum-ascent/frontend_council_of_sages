import { ApiService } from './api'
import type { OrchestratorRequest, OrchestratorResponse } from '@/types/api'

class OrchestratorService {
  private readonly timeout: number
  private readonly userId: string

  constructor() {
    this.timeout = Number(import.meta.env.VITE_API_TIMEOUT) || 30000
    this.userId = import.meta.env.VITE_USER_ID || 'default_user'
  }

  async sendQuery(
    query: string,
    conversationId: string | null = null
  ): Promise<OrchestratorResponse> {
    const request: OrchestratorRequest = {
      query: query.trim(),
      user_id: this.userId,
      conversation_id: conversationId,
    }

    try {
      const response = await ApiService.post<OrchestratorResponse>(
        '/orchestrator',
        request,
        {
          timeout: this.timeout,
        }
      )
      return response
    } catch (error) {
      console.error('Orchestrator service error:', error)
      throw new Error('Failed to get response from Council of Sages')
    }
  }
}

export const orchestratorService = new OrchestratorService()
