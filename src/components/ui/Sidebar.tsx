import { ChevronLeft, LogOut, User, MessageSquare } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useBalance } from '@/hooks/useBalance'
import { timeAgo } from '@/utils/time'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { user, signOut } = useAuth()
  const { balance, loading, error, fetchBalance, needsTopUp } = useBalance()

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
              className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-gray-200"
              aria-label="Close sidebar"
            >
              <ChevronLeft
                style={{
                  width: '16px',
                  height: '16px',
                  minWidth: '16px',
                  minHeight: '16px',
                }}
              />
            </button>
          </div>

          {/* Content Area - Future chat history will go here */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {/* Placeholder for future chat history */}
              <div className="py-8 text-center text-sm text-gray-500">
                <MessageSquare
                  style={{
                    width: '32px',
                    height: '32px',
                    minWidth: '32px',
                    minHeight: '32px',
                  }}
                  className="mx-auto mb-2 opacity-50"
                />
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
                    <User
                      style={{
                        width: '16px',
                        height: '16px',
                        minWidth: '16px',
                        minHeight: '16px',
                      }}
                      className="text-gray-600"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {user?.displayName || 'User'}
                  </p>
                  <p className="truncate text-xs text-gray-600">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Balance Section */}
              <div className="rounded-md bg-white/60 p-3 text-sm text-gray-800">
                <div className="flex items-baseline justify-between">
                  <span className="font-medium">Balance</span>
                  <span>
                    {loading
                      ? '—'
                      : balance
                        ? `$${balance.balance_usd.toFixed(2)}`
                        : '—'}
                  </span>
                </div>
                {!!balance && (
                  <div className="mt-1 text-xs text-gray-500">
                    Updated {timeAgo(balance.updated_at)}
                  </div>
                )}
                {error && (
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-red-600">Failed to load</span>
                    <button
                      onClick={fetchBalance}
                      className="text-xs text-gray-600 underline hover:text-gray-800"
                    >
                      Retry
                    </button>
                  </div>
                )}
                {needsTopUp && (
                  <div className="mt-2 rounded border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">⚠️ Action Required:</span>
                    </div>
                    <div className="mt-1">
                      Your balance is below $0. Please top-up to continue
                      sending messages.
                    </div>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-900"
              >
                <LogOut
                  style={{
                    width: '16px',
                    height: '16px',
                    minWidth: '16px',
                    minHeight: '16px',
                  }}
                />
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
