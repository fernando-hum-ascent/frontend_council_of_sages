// Request/Response Types
export interface OrchestratorRequest {
  query: string
  conversation_id?: string
  timestamp: string
  metadata?: {
    client_type: 'web' | 'mobile'
    user_agent?: string
    timestamp: number
    [key: string]: any
  }
  // user_id is now extracted from Firebase JWT token by backend
}

export interface OrchestratorResponse {
  response: string
  conversation_id: string
  agent_queries: Record<string, string>
  agent_responses: Record<string, string>
}

export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
  conversation_id?: string
  agent_queries?: Record<string, string>
  metadata?: Record<string, any>
}

// Auth-related API types
export interface AuthenticatedApiResponse<T = any> {
  data: T
  success: boolean
  message?: string
  timestamp: string
}

export interface UserProfile {
  uid: string
  email: string
  display_name?: string
  photo_url?: string
  created_at: string
  last_login: string
  preferences?: {
    theme?: 'light' | 'dark' | 'auto'
    language?: string
    notifications?: boolean
    [key: string]: any
  }
}

export interface ConversationSummary {
  id: string
  title: string
  last_message: string
  last_updated: string
  message_count: number
  created_at: string
}

// API Error types
export interface ApiErrorResponse {
  error: string
  code?: string
  details?: Record<string, any>
  timestamp: string
}

// UI State Types
export interface ConversationState {
  id: string | null
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
}
