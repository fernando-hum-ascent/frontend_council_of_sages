import React, { useState } from 'react'
import { Send, RotateCcw } from 'lucide-react'
import { cn } from '@/utils/cn'

interface ChatInputProps {
  onSend?: (message: string) => void
  onReset?: () => void
  placeholder?: string
  disabled?: boolean
  value?: string
  onChange?: (value: string) => void
  showReset?: boolean
  isLoading?: boolean
}

export function ChatInput({
  onSend,
  onReset,
  placeholder = 'Ask your council anything...',
  disabled = false,
  value,
  onChange,
  showReset = false,
}: ChatInputProps) {
  const [internalMessage, setInternalMessage] = useState('')

  // Determine if component is controlled
  const isControlled = value !== undefined
  const message = isControlled ? value : internalMessage

  // Unified change handler
  const handleChange = (newValue: string) => {
    // Update internal state only if uncontrolled
    if (!isControlled) {
      setInternalMessage(newValue)
    }
    // Always call onChange if provided
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
    // Avoid sending while using IMEs (composition in progress)
    if ((e.nativeEvent as CompositionEvent).isComposing) return

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
