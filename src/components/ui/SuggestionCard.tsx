interface SuggestionCardProps {
  title: string
  description?: string
  onClick?: () => void
  className?: string
}

export function SuggestionCard({
  title,
  description,
  onClick,
  className = '',
}: SuggestionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`dark:hover:bg-gray-750 group w-full rounded-lg border border-gray-200 bg-white p-3 text-left transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 ${className}`}
      style={{ minHeight: '44px' }}
    >
      <h3 className="text-sm font-medium leading-tight text-gray-900 group-hover:text-gray-700 dark:text-white dark:group-hover:text-gray-200">
        {title}
      </h3>
      {description && (
        <p className="mt-1 text-xs leading-tight text-gray-600 dark:text-gray-400">
          {description}
        </p>
      )}
    </button>
  )
}
