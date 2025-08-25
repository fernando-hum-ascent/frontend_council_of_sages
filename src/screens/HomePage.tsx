import { useState, useRef, useEffect } from 'react'
import { useConversationStore } from '@/store/conversationStore'
import { useBalance } from '@/hooks/useBalance'
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
  const lastUserMessageRef = useRef<HTMLDivElement>(null)
  const { isOpen, toggle } = useSidebar()
  const { needsTopUp } = useBalance()

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    resetConversation,
    clearError,
  } = useConversationStore()

  const suggestions = [
    'How should one navigate a career path in the AI era? - Include Marcus Aurelius in the council',
    'How can I distinguish between intuition and bias? - Include Ghandi in the council',
    'Does this plan [brief plan] benefit from AI progress, or is it fragile to it?',
    'What is a robust framework for making high-stakes decisions?',
    "What's the best way to decide when to quit versus persist in a project?",
    'Stress-test this plan: [brief plan]. Where could it fail and how to hedge?',
  ]

  // Auto scroll to most recent user message when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      // Find the most recent user message
      const lastUserMessage = [...messages]
        .reverse()
        .find((msg) => msg.role === 'user')
      if (lastUserMessage && lastUserMessageRef.current) {
        lastUserMessageRef.current.scrollIntoView({ behavior: 'smooth' })
      } else {
        // Fallback to bottom if no user message found
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }
    }
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
        {/* Content Area */}
        <div className="flex flex-1 flex-col">
          {/* Sidebar Toggle - Only show when sidebar is closed */}
          {!isOpen && (
            <div className="fixed left-4 top-4 z-20">
              <SidebarToggle onClick={toggle} />
            </div>
          )}

          {/* Header - only show when no messages */}
          {messages.length === 0 && (
            <div className="flex flex-col justify-center px-4 py-4">
              <div className="mx-auto w-full max-w-2xl">
                <div className="mb-4 text-center">
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
          {messages.length > 0 ? (
            <div className="flex-1 overflow-y-auto px-4 py-8">
              <div className="mx-auto max-w-3xl space-y-6">
                {messages.map((message, index) => {
                  // Find the most recent user message
                  const lastUserMessageIndex = [...messages]
                    .reverse()
                    .findIndex((m) => m.role === 'user')
                  const actualLastUserMessageIndex =
                    lastUserMessageIndex !== -1
                      ? messages.length - 1 - lastUserMessageIndex
                      : -1
                  const isLastUserMessage = index === actualLastUserMessageIndex

                  return (
                    <div
                      key={message.id}
                      ref={isLastUserMessage ? lastUserMessageRef : null}
                    >
                      <ChatMessage message={message} />
                    </div>
                  )
                })}

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
          ) : (
            <div className="h-8" />
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
                disabled={isLoading || needsTopUp}
                placeholder={
                  needsTopUp
                    ? 'Top-up required to send messages'
                    : 'Message Council of Sages...'
                }
              />

              {/* Reset conversation button - only show when there are messages */}
              {messages.length > 0 && (
                <div className="mt-3 text-center">
                  <button
                    onClick={handleReset}
                    className="rounded-md px-4 py-2 text-sm text-white hover:opacity-80"
                    style={{ backgroundColor: '#396362' }}
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
                      className="rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-left text-sm text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:bg-transparent dark:text-gray-400 dark:hover:border-gray-600 dark:hover:bg-gray-900/20 dark:hover:text-gray-300"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contact Footer */}
        <div className="px-4 py-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              For any doubt or suggestion please contact
              fernando@council-of-sages.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
