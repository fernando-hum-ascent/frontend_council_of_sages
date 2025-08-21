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

  // Basic mobile detection to tweak Enter key behavior on touch devices
  const isMobile =
    (typeof navigator !== 'undefined' &&
      /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) ||
    (typeof window !== 'undefined' &&
      (navigator.maxTouchPoints > 0 ||
        (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)))

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
    if (e.nativeEvent.isComposing) return

    if (e.key === 'Enter' && !e.shiftKey) {
      // On mobile, let Enter insert a newline instead of sending
      if (isMobile) return

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
        <div className="relative flex items-end rounded-2xl bg-white shadow-lg dark:bg-gray-800">
          <textarea
            value={message}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={cn(
              'max-h-[200px] min-h-[52px] flex-1 resize-none bg-white px-4 py-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none dark:bg-gray-800 dark:text-white dark:placeholder-gray-400',
              showReset ? 'pr-24' : 'pr-12',
              disabled && 'cursor-not-allowed opacity-75'
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
                className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm transition-all hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                style={{ backgroundColor: '#396362' }}
                aria-label="Reset conversation"
                title="Reset conversation"
              >
                <RotateCcw
                  style={{
                    width: '24px',
                    height: '24px',
                    minWidth: '24px',
                    minHeight: '24px',
                  }}
                />
              </button>
            )}

            <button
              type="submit"
              disabled={disabled || !message.trim()}
              className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm transition-all hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:text-gray-500"
              style={{
                backgroundColor:
                  disabled || !message.trim() ? '#88a1a0' : '#396362',
              }}
              aria-label="Send message"
            >
              <Send
                style={{
                  width: '24px',
                  height: '24px',
                  minWidth: '24px',
                  minHeight: '24px',
                }}
              />
            </button>
          </div>
        </div>
      </form>
      <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
        {isMobile
          ? 'Tap Send to submit. Enter adds a new line'
          : 'Press Enter to send, Shift+Enter for new line'}
        {showReset && ' • Reset button clears conversation'}
      </div>
    </div>
  )
}
