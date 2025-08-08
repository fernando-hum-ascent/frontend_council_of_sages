import { useState } from 'react'
import { ChatInput } from '@/components/ui/ChatInput'
import councilImage from '@/assets/council.png'

export function HomePage() {
  const [inputValue, setInputValue] = useState('')

  const suggestions = [
    {
      title: 'Help me plan a project timeline',
      description: 'Break down tasks and create a realistic schedule',
    },
    {
      title: 'Explain a complex concept',
      description: 'Get clear explanations with examples',
    },
    {
      title: 'Write a professional email',
      description: 'Draft formal communications and responses',
    },
    {
      title: 'Analyze data patterns',
      description: 'Find insights and trends in your data',
    },
    {
      title: 'Create a presentation outline',
      description: 'Structure your ideas into compelling presentations',
    },
    {
      title: 'Debug my code',
      description: 'Find and fix issues in your programming projects',
    },
  ]

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  const handleSend = (message: string) => {
    console.log('Sent message:', message)
    setInputValue('')
  }

  return (
    <div className="flex min-h-screen flex-col justify-center px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        {/* Logo Header */}
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

        {/* Chat Input */}
        <div className="mb-6">
          <ChatInput
            placeholder="Ask your council anything..."
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
          />
        </div>

        {/* Smaller Suggestions */}
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-2">
          {suggestions.slice(0, 4).map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion.title)}
              className="rounded border border-gray-200 p-2 text-left text-xs text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            >
              {suggestion.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
