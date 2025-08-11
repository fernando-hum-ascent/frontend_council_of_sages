// Request/Response Types
export interface OrchestratorRequest {
  query: string
  user_id: string
  conversation_id: string | null
}

export interface OrchestratorResponse {
  response: string
  conversation_id: string
  agent_queries: Record<string, string>
  agent_responses: Record<string, string>
}

// UI State Types
export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  agentQueries?: Record<string, string>
  agentResponses?: Record<string, string>
}

export interface ConversationState {
  id: string | null
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
}
