import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 sm:mb-8">
          <h1 className="mb-4 text-5xl font-bold text-gray-900 sm:text-6xl dark:text-white">
            404
          </h1>
          <h2 className="mb-4 text-xl font-semibold text-gray-700 sm:text-2xl dark:text-gray-300">
            Page Not Found
          </h2>
          <p className="mb-6 text-sm text-gray-600 sm:mb-8 sm:text-base dark:text-gray-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-blue-600 px-6 py-4 text-base font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Home size={20} />
          Go Home
        </Link>
      </div>
    </div>
  )
}
