import { formatDistanceToNow } from 'date-fns'
import { User, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { ChatMessage as ChatMessageType } from '@/types/api'
import sageImage from '@/assets/sage.png'

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [showDetails, setShowDetails] = useState(false)
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{ backgroundColor: '#f0ecf0' }}
        >
          <img src={sageImage} alt="Council" className="h-6 w-6 rounded-full" />
        </div>
      )}

      <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        <div
          className="rounded-2xl px-4 py-3 text-gray-900"
          style={{ backgroundColor: isUser ? '#f0eee6' : '#f0ecf0' }}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
          <span>
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </span>

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
            <h4 className="font-medium text-gray-900 dark:text-white">
              Agent Queries:
            </h4>
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
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{ backgroundColor: '#f0eee6' }}
        >
          <User className="h-4 w-4 text-gray-600" />
        </div>
      )}
    </div>
  )
}
