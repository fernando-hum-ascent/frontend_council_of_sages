# Add ChatGPT-Style Left Sidebar with Logout (Phase 1)

## Overview

This document outlines the implementation of a collapsible left sidebar similar to ChatGPT's interface, featuring minimal functionality: user information display, logout button, and prepared structure for future chat history. This maintains the current clean homepage design while adding essential user controls.

## Current State Analysis

### Existing Layout Structure

- **Homepage**: Clean ChatGPT-style layout with `backgroundColor: '#faf9f5'`
- **Layout Component**: Special handling for homepage (`/`) and auth (`/auth`) with minimal layout
- **Auth System**: Working Firebase authentication with user object containing:
  - `uid`, `email`, `displayName`, `photoURL`, `emailVerified`
- **State Management**: Zustand stores for auth and conversations

### Current Homepage Flow

1. Empty state: Shows council logo and title with suggestions
2. With messages: Shows conversation thread with chat interface
3. Clean minimal design without traditional navigation

## Implementation Plan

### Phase 1: Core Sidebar Structure

#### 1.1 Create Sidebar Components

**New file**: `src/components/ui/Sidebar.tsx`

```typescript
import { useState } from 'react'
import { ChevronLeft, ChevronRight, LogOut, User, MessageSquare } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { UserProfile } from './UserProfile'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { user, signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <>
      {/* Sidebar Container */}
      <div
        className={`fixed left-0 top-0 z-40 h-full text-gray-800 transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64' : 'w-0'
        } overflow-hidden border-r border-gray-200`}
        style={{ backgroundColor: '#f5f4ed' }}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4">
            <h2 className="font-medium text-gray-800">Council of Sages</h2>
            <button
              onClick={onToggle}
              className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-200 transition-colors"
              aria-label="Close sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>

          {/* Content Area - Future chat history will go here */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {/* Placeholder for future chat history */}
              <div className="text-center text-gray-500 text-sm py-8">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Chat history will appear here</p>
              </div>
            </div>
          </div>

          {/* User Section */}
          <div className="border-t border-gray-200 p-4">
            <div className="space-y-3">
              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <User className="h-4 w-4 text-gray-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {user?.displayName || 'User'}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={onToggle}
        />
      )}
    </>
  )
}
```

**New file**: `src/components/ui/SidebarToggle.tsx`

```typescript
import { Menu } from 'lucide-react'

interface SidebarToggleProps {
  onClick: () => void
  className?: string
}

export function SidebarToggle({ onClick, className = '' }: SidebarToggleProps) {
  return (
    <button
      onClick={onClick}
      className={`flex h-10 w-10 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors ${className}`}
      aria-label="Open sidebar"
    >
      <Menu className="h-5 w-5" />
    </button>
  )
}
```

#### 1.2 Create Sidebar Hook

**New file**: `src/hooks/useSidebar.ts`

```typescript
import { useState, useCallback } from 'react'

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  return {
    isOpen,
    toggle,
    open,
    close,
  }
}
```

#### 1.3 Update Homepage Layout

**File to modify**: `src/screens/HomePage.tsx`

```typescript
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
      <div className={`flex min-h-screen flex-col flex-1 transition-all duration-300 ${isOpen ? 'md:ml-64' : ''}`}>
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

        {/* Suggestions - only show when no messages */}
        {messages.length === 0 && (
          <div className="px-4 pb-6">
            <div className="mx-auto max-w-2xl">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-700 shadow-sm transition-all hover:shadow-md hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600"
                  >
                    {suggestion}
                  </button>
                ))}
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
      </div>
    </div>
  )
}
```

#### 1.4 Enhanced UserProfile Component

**New file**: `src/components/ui/UserProfile.tsx`

```typescript
import { useState } from 'react'
import { User, Edit2, Check, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface UserProfileProps {
  compact?: boolean
  className?: string
}

export function UserProfile({ compact = false, className = '' }: UserProfileProps) {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState(user?.displayName || '')

  const handleSave = async () => {
    if (displayName.trim() && displayName !== user?.displayName) {
      try {
        await updateProfile({ displayName: displayName.trim() })
      } catch (error) {
        console.error('Failed to update profile:', error)
      }
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setDisplayName(user?.displayName || '')
    setIsEditing(false)
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <User className="h-4 w-4 text-gray-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">
            {user?.displayName || 'User'}
          </p>
          <p className="text-xs text-gray-600 truncate">
            {user?.email}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Profile Picture */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-300">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="h-20 w-20 rounded-full"
              />
            ) : (
              <User className="h-8 w-8 text-gray-600" />
            )}
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="space-y-3">
        {/* Display Name */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Display Name
          </label>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter display name"
              />
              <button
                onClick={handleSave}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-green-600 text-white hover:bg-green-700"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={handleCancel}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-400 text-white hover:bg-gray-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-800">
                {user?.displayName || 'Not set'}
              </span>
              <button
                onClick={() => setIsEditing(true)}
                className="flex h-6 w-6 items-center justify-center rounded text-gray-600 hover:text-gray-800"
              >
                <Edit2 className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Email
          </label>
          <span className="text-sm text-gray-800">{user?.email}</span>
        </div>

        {/* Email Verification Status */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Email Status
          </label>
          <span className={`text-xs px-2 py-1 rounded-full ${
            user?.emailVerified
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {user?.emailVerified ? 'Verified' : 'Unverified'}
          </span>
        </div>
      </div>
    </div>
  )
}
```

### Phase 2: Integration and Styling

#### 2.1 Update Layout Component

**File to modify**: `src/components/common/Layout.tsx`

```typescript
import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Brain, LogIn, User } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { user, isAuthenticated, signOut } = useAuth()

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'About', href: '/about', current: location.pathname === '/about' },
  ]

  // Clean minimal layout for homepage and auth page (ChatGPT style)
  // Homepage now handles its own layout with sidebar
  if (location.pathname === '/' || location.pathname === '/auth') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#faf9f5' }}>
        <main>{children}</main>
      </div>
    )
  }

  // Full layout for other screens (About, Profile, etc.)
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <Brain className="h-8 w-8 text-blue-600" />
                <span className="font-heading text-xl font-bold text-gray-900 dark:text-white">
                  Council of Sages
                </span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex min-h-[44px] items-center rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                    item.current
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Auth Section */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                      {user?.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="Profile"
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <User className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {user?.displayName || user?.email}
                    </span>
                  </div>
                  <Link
                    to="/profile"
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={signOut}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md p-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-gray-700"
                aria-expanded={isMenuOpen}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="space-y-1 border-t border-gray-200 px-2 pb-3 pt-2 sm:px-3 dark:border-gray-700">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block flex min-h-[44px] items-center rounded-md px-4 py-4 text-base font-medium transition-colors ${
                      item.current
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Mobile Auth Section */}
                <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
                  {isAuthenticated ? (
                    <div className="space-y-1">
                      <div className="flex items-center px-4 py-2">
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                          {user?.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt="Profile"
                              className="h-8 w-8 rounded-full"
                            />
                          ) : (
                            <User className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {user?.displayName || user?.email}
                        </span>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="block rounded-md px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          signOut()
                          setIsMenuOpen(false)
                        }}
                        className="block w-full text-left rounded-md px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/auth"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700 mx-4"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Sign In</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Council of Sages. Built with
              React, TypeScript, and Tailwind CSS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
```

### Phase 3: Future-Proofing for Chat History

#### 3.1 Prepare Chat History Structure

**New file**: `src/components/ui/ChatHistoryList.tsx` (Placeholder)

```typescript
import { MessageSquare, Calendar } from 'lucide-react'

// Placeholder component for future chat history implementation
export function ChatHistoryList() {
  return (
    <div className="space-y-2">
      {/* Future implementation will include:
          - List of conversation summaries
          - Search functionality
          - Date grouping
          - Delete/rename options
          - Infinite scrolling
      */}

      <div className="text-center text-gray-500 text-sm py-8">
        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>Chat history will appear here</p>
        <p className="text-xs mt-1">Future feature</p>
      </div>

      {/* Example structure for future implementation */}
      {false && (
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-600 px-2 py-1">
            Today
          </div>
          <button className="w-full text-left rounded-md p-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-3 w-3" />
              <span className="truncate">Project planning discussion</span>
            </div>
          </button>
          <button className="w-full text-left rounded-md p-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-3 w-3" />
              <span className="truncate">Code review questions</span>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}
```

#### 3.2 Conversation Store Extension (Future)

**Comment for future enhancement in**: `src/store/conversationStore.ts`

```typescript
// Future enhancements for chat history:
// - Add conversation list management
// - Add conversation summaries
// - Add conversation persistence
// - Add search functionality
// - Add conversation metadata (title, date, participants)

// Example future interface:
// interface ConversationSummary {
//   id: string
//   title: string
//   lastMessage: string
//   lastUpdated: string
//   messageCount: number
// }
//
// interface ConversationState {
//   conversations: ConversationSummary[]
//   currentConversationId: string | null
//   // ... existing state
// }
```

## Implementation Summary

### Key Features Added

1. **Collapsible Sidebar**: ChatGPT-style dark sidebar with smooth animations
2. **User Information Display**: Shows user avatar, name, and email
3. **Logout Functionality**: Prominent logout button in sidebar
4. **Responsive Design**: Mobile-friendly with overlay and proper breakpoints
5. **Future-Ready Structure**: Prepared for chat history integration

### Design Principles

- **Minimal Interface**: Maintains clean ChatGPT-like aesthetic
- **Light Theme Sidebar**: Uses subtle background color (#f5f4ed) matching the app's color scheme
- **Smooth Animations**: Professional feel with CSS transitions
- **Mobile-First**: Works seamlessly across all devices
- **Accessible**: Proper ARIA labels and keyboard navigation

### Benefits

1. **User Control**: Easy access to logout and user information
2. **Space Efficiency**: Collapsible design doesn't interfere with chat
3. **Professional Look**: Matches expectations from modern chat interfaces
4. **Extensible**: Ready for chat history without major refactoring
5. **Consistent**: Maintains existing design language and patterns

### Implementation Steps

1. **Create Sidebar Components**: Build core sidebar UI components
2. **Add Sidebar Hook**: Implement state management for sidebar visibility
3. **Update Homepage**: Integrate sidebar with existing chat interface
4. **Enhance User Profile**: Create expandable user profile component
5. **Test Responsiveness**: Verify mobile and desktop functionality
6. **Future-Proof**: Add placeholder structure for chat history

### File Structure After Implementation

```
src/
├── components/
│   └── ui/
│       ├── Sidebar.tsx                 [NEW] - Main sidebar component
│       ├── SidebarToggle.tsx           [NEW] - Toggle button
│       ├── UserProfile.tsx             [NEW] - User info display
│       └── ChatHistoryList.tsx         [NEW] - Placeholder for future
├── hooks/
│   └── useSidebar.ts                   [NEW] - Sidebar state management
├── screens/
│   └── HomePage.tsx                    [MODIFIED] - Add sidebar integration
└── components/common/
    └── Layout.tsx                      [MODIFIED] - Updated for sidebar
```

### Testing Checklist

- [ ] Sidebar opens and closes smoothly
- [ ] User information displays correctly
- [ ] Logout functionality works
- [ ] Mobile responsiveness verified
- [ ] Chat interface remains functional
- [ ] No layout conflicts with existing features
- [ ] Keyboard navigation works
- [ ] Screen reader accessibility verified

This implementation provides a solid foundation for the logout feature while preparing for future chat history functionality, maintaining the clean aesthetic of the current application.
