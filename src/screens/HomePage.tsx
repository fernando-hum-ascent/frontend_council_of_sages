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
    clearError,
  } = useConversationStore()

  const suggestions = [
    'Help me plan a project timeline',
    'Explain a complex concept',
    'Write a professional email',
    'Analyze data patterns',
    'Create a presentation outline',
    'Debug my code',
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
