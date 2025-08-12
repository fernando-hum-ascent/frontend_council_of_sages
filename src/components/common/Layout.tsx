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
  if (location.pathname === '/' || location.pathname === '/auth') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#faf9f5' }}>
        <main>{children}</main>
      </div>
    )
  }

  // Full layout for other screens
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
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {user?.displayName || user?.email}
                    </span>
                  </div>
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
                        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
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
                      <button
                        onClick={() => {
                          signOut()
                          setIsMenuOpen(false)
                        }}
                        className="block w-full rounded-md px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/auth"
                      onClick={() => setIsMenuOpen(false)}
                      className="mx-4 flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700"
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
