import { useState, useRef, useEffect } from 'react'
import { useConversationStore } from '@/store/conversationStore'
import { ChatInput } from '@/components/ui/ChatInput'
import { ChatMessage } from '@/components/ui/ChatMessage'
import { LoadingDots } from '@/components/ui/LoadingDots'
import { Sidebar } from '@/components/ui/Sidebar'
import { SidebarToggle } from '@/components/ui/SidebarToggle'
import { useSidebar } from '@/hooks/useSidebar'
import { AlertTriangle } from 'lucide-react'
import councilImage from '@/assets/council.png'
import sageImage from '@/assets/sage.png'

export function HomePage() {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { isOpen, toggle } = useSidebar()

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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} onToggle={toggle} />

      {/* Main Content */}
      <div
        className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ${isOpen ? 'md:ml-64' : ''}`}
      >
        {/* Sidebar Toggle - Only show when sidebar is closed */}
        {!isOpen && (
          <div className="absolute left-4 top-4 z-20">
            <SidebarToggle onClick={toggle} />
          </div>
        )}

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
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full"
                      style={{ backgroundColor: '#f0ecf0' }}
                    >
                      <img
                        src={sageImage}
                        alt="Council"
                        className="h-6 w-6 rounded-full"
                      />
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
          <div className="mx-4 mb-4">
            <div className="mx-auto max-w-3xl rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <div className="flex-1">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </div>
                <button
                  onClick={clearError}
                  className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Input */}
        <div className="px-4 pb-6">
          <div className="mx-auto max-w-3xl">
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSend}
              disabled={isLoading}
              placeholder="Message Council of Sages..."
            />

            {/* Reset conversation button - only show when there are messages */}
            {messages.length > 0 && (
              <div className="mt-3 text-center">
                <button
                  onClick={handleReset}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Start new conversation
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Suggestions - only show when no messages */}
        {messages.length === 0 && (
          <div className="px-4 pb-6">
            <div className="mx-auto max-w-2xl">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
