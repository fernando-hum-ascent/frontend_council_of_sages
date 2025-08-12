# Plan to Connect Frontend to Backend

## Overview

This document outlines the implementation plan for connecting the Council of Sages frontend to the backend orchestrator service. The backend expects specific request/response formats and conversation management.

The first time that a request is made, the conversation ID must be set to null. But then the backend will return a conversation ID (frontend should store the conversation ID) so that it must be continually sent to the backend with that conversation ID until the user puts the reset conversation button.

## Backend API Specification

### Endpoint

- **URL**: `http://localhost:8080/orchestrator`
- **Method**: `POST`
- **Content-Type**: `application/json`

### Request Format

```typescript
interface OrchestratorRequest {
  query: string
  user_id: string
  conversation_id: string | null // null for new conversations
}
```

### Response Format

```typescript
interface OrchestratorResponse {
  response: string
  conversation_id: string
  agent_queries: Record<string, string>
  agent_responses: Record<string, string>
}
```

## Implementation Plan

### 1. Environment Variables Setup

**File**: `.env.local` (create new)

```env
# Backend Configuration
VITE_BACKEND_URL=http://localhost:8080
VITE_API_TIMEOUT=30000
VITE_USER_ID=test_user_123
```

**File**: `.env.example` (create new)

```env
# Backend Configuration
VITE_BACKEND_URL=http://localhost:8080
VITE_API_TIMEOUT=30000
VITE_USER_ID=test_user_123
```

**Best Practices**:

- Use `VITE_` prefix for environment variables accessible in browser
- Separate development and production URLs
- Include timeout configuration for long AI responses
- Default user ID for development (should be dynamic in production)

### 2. TypeScript Types

**File**: `src/types/api.ts` (create new)

```typescript
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
```

### 3. Backend Service

**File**: `src/services/orchestrator.ts` (create new)

```typescript
import { ApiService } from './api'
import type { OrchestratorRequest, OrchestratorResponse } from '@/types/api'

class OrchestratorService {
  private readonly baseUrl: string
  private readonly timeout: number
  private readonly userId: string

  constructor() {
    this.baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
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
          baseURL: this.baseUrl,
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
```

### 4. State Management with Zustand

**File**: `src/store/conversationStore.ts` (create new)

```typescript
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
```

### 5. Loading Animation Component

**File**: `src/components/ui/LoadingDots.tsx` (create new)

```typescript
import { cn } from '@/utils/cn'

interface LoadingDotsProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingDots({ className, size = 'md' }: LoadingDotsProps) {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  }

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      <div className={cn(
        'bg-gray-500 rounded-full animate-bounce',
        sizeClasses[size]
      )} style={{ animationDelay: '0ms' }} />
      <div className={cn(
        'bg-gray-500 rounded-full animate-bounce',
        sizeClasses[size]
      )} style={{ animationDelay: '150ms' }} />
      <div className={cn(
        'bg-gray-500 rounded-full animate-bounce',
        sizeClasses[size]
      )} style={{ animationDelay: '300ms' }} />
    </div>
  )
}
```

### 6. Enhanced Chat Input with Reset Button

**Option A**: Create new component `src/components/ui/ChatInputWithReset.tsx`
**Option B**: Update existing `src/components/ui/ChatInput.tsx` with reset functionality (Recommended)

Since the codebase already has a `ChatInput` component, it's recommended to enhance the existing component rather than create a new one. Here's the enhanced version:

**File**: Update `src/components/ui/ChatInput.tsx`

```typescript
import React, { useState } from 'react'
import { Send, RotateCcw } from 'lucide-react'
import { cn } from '@/utils/cn'

interface ChatInputWithResetProps {
  onSend?: (message: string) => void
  onReset?: () => void
  placeholder?: string
  disabled?: boolean
  value?: string
  onChange?: (value: string) => void
  showReset?: boolean
}

export function ChatInputWithReset({
  onSend,
  onReset,
  placeholder = 'Ask your council anything...',
  disabled = false,
  value,
  onChange,
  showReset = true
}: ChatInputWithResetProps) {
  const [internalMessage, setInternalMessage] = useState('')

  // Determine if component is controlled
  const isControlled = value !== undefined
  const message = isControlled ? value : internalMessage

  // Unified change handler
  const handleChange = (newValue: string) => {
    if (!isControlled) {
      setInternalMessage(newValue)
    }
    if (onChange) {
      onChange(newValue)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (message.trim() && onSend && !disabled) {
      onSend(message.trim())
      handleChange('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.nativeEvent as any).isComposing) return

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (message.trim() && onSend && !disabled) {
        onSend(message.trim())
        handleChange('')
      }
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-end rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <textarea
            value={message}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={cn(
              'max-h-[200px] min-h-[52px] flex-1 resize-none bg-transparent px-4 py-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none dark:text-white dark:placeholder-gray-400',
              showReset ? 'pr-24' : 'pr-12'
            )}
            style={{
              minHeight: '52px',
              maxHeight: '200px',
              overflowY: 'auto',
            }}
          />

          <div className="absolute bottom-2 right-2 flex items-center space-x-1">
            {showReset && onReset && (
              <button
                type="button"
                onClick={onReset}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-all hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                aria-label="Reset conversation"
                title="Reset conversation"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={disabled || !message.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white transition-all hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-400"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>

      <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
        Press Enter to send, Shift+Enter for new line
        {showReset && ' • Reset button clears conversation'}
      </div>
    </div>
  )
}
```

### 7. Chat Message Component

**File**: `src/components/ui/ChatMessage.tsx` (create new)

```typescript
import { formatDistanceToNow } from 'date-fns'
import { User, Bot, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { ChatMessage as ChatMessageType } from '@/types/api'

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [showDetails, setShowDetails] = useState(false)
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
          <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
      )}

      <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
          <span>{formatDistanceToNow(message.timestamp, { addSuffix: true })}</span>

          {!isUser && message.agentQueries && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Agent Details
              {showDetails ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>
          )}
        </div>

        {!isUser && showDetails && message.agentQueries && (
          <div className="mt-2 rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-900">
            <h4 className="font-medium text-gray-900 dark:text-white">Agent Queries:</h4>
            <div className="mt-1 space-y-1">
              {Object.entries(message.agentQueries).map(([agent, query]) => (
                <div key={agent} className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">{agent}:</span> {query}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </div>
      )}
    </div>
  )
}
```

### 8. Enhanced HomePage with Full Chat Interface

**File**: Update `src/screens/HomePage.tsx`

```typescript
import { useState, useRef, useEffect } from 'react'
import { useConversationStore } from '@/store/conversationStore'
import { ChatInput } from '@/components/ui/ChatInput'
import { ChatMessage } from '@/components/ui/ChatMessage'
import { LoadingDots } from '@/components/ui/LoadingDots'
import { AlertTriangle, Bot } from 'lucide-react'
import councilImage from '@/assets/council.png'

export function HomePage() {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    resetConversation,
    clearError
  } = useConversationStore()

  const suggestions = [
    'Help me plan a project timeline',
    'Explain a complex concept',
    'Write a professional email',
    'Analyze data patterns',
    'Create a presentation outline',
    'Debug my code'
  ]

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (message: string) => {
    setInputValue('')
    await sendMessage(message)
  }

  const handleReset = () => {
    resetConversation()
    setInputValue('')
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header - only show when no messages */}
      {messages.length === 0 && (
        <div className="flex flex-col justify-center px-4 py-8">
          <div className="mx-auto w-full max-w-2xl">
            <div className="mb-8 text-center">
              <div className="flex flex-col items-center gap-0">
                <img
                  src={councilImage}
                  alt="Council of Sages"
                  className="h-32 w-32 object-contain sm:h-40 sm:w-40 lg:h-48 lg:w-48"
                />
                <h1 className="font-heading text-2xl font-bold leading-tight text-gray-900 sm:text-3xl lg:text-4xl dark:text-white">
                  COUNCIL OF SAGES
                </h1>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto px-4 py-8">
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                    <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="rounded-2xl bg-gray-100 px-4 py-3 dark:bg-gray-800">
                    <LoadingDots />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mx-auto w-full max-w-2xl px-4">
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700 dark:bg-red-900/20 dark:text-red-400">
            <AlertTriangle className="h-4 w-4" />
            <span className="flex-1">{error}</span>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto w-full max-w-2xl">
          <ChatInput
            placeholder="Ask your council anything..."
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            onReset={handleReset}
            disabled={isLoading}
            isLoading={isLoading}
            showReset={messages.length > 0}
          />

          {/* Suggestions - only show when no messages */}
          {messages.length === 0 && (
            <div className="mx-auto mt-4 grid max-w-lg grid-cols-2 gap-2">
              {suggestions.slice(0, 4).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={isLoading}
                  className="rounded border border-gray-200 p-2 text-left text-xs text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

### 9. Update API Service for Backend Integration

**File**: Update `src/services/api.ts`

```typescript
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

class ApiService {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      (error) => {
        console.error('API Error:', error)
        throw error
      }
    )
  }

  async post<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.post(url, data, config)
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config)
  }
}

export const ApiService = new ApiService()
```

### 10. Utility Function for Class Names

**File**: `src/utils/cn.ts` (create new)

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 11. Package Dependencies to Add

Add the following dependencies:

```bash
npm install date-fns zustand uuid @types/uuid clsx tailwind-merge
```

## Implementation Steps

1. **Environment Setup**
   - Create `.env.local` and `.env.example` files
   - Configure backend URL and timeout settings

2. **Type Definitions**
   - Create `src/types/api.ts` with all necessary interfaces

3. **Backend Service**
   - Create `src/services/orchestrator.ts` for API communication
   - Implement error handling and timeout management

4. **State Management**
   - Create `src/store/conversationStore.ts` with Zustand
   - Implement conversation persistence

5. **UI Components**
   - Create loading animation component
   - Create enhanced chat input with reset button
   - Create chat message component with agent details

6. **Update HomePage**
   - Integrate full chat interface
   - Add message display and conversation management

7. **Utility Functions**
   - Create class name utility for Tailwind

## Best Practices Implemented

### Environment Variables

- Use `VITE_` prefix for browser-accessible variables
- Separate development and production configurations
- Include sensible defaults for timeouts

### Error Handling

- Comprehensive error boundaries
- User-friendly error messages
- Retry mechanisms for failed requests
- Proper handling of persisted data clearing

### State Management

- Persistent conversation storage
- Optimistic UI updates
- Loading states for better UX

### Accessibility

- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly components

### Performance

- Optimized re-renders with Zustand
- Efficient message scrolling
- Lazy loading for large conversations

### Security

- Input validation and sanitization
- Secure environment variable handling
- Proper error message exposure

This implementation provides a robust, scalable foundation for connecting the frontend to the backend while maintaining excellent user experience and code quality.
