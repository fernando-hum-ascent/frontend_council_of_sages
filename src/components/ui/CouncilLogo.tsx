import { Users } from 'lucide-react'

interface CouncilLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export function CouncilLogo({
  size = 'md',
  showText = true,
  className = '',
}: CouncilLogoProps) {
  const sizeClasses = {
    sm: {
      icon: 'h-6 w-6',
      text: 'text-lg',
      gap: 'gap-2',
    },
    md: {
      icon: 'h-8 w-8',
      text: 'text-xl',
      gap: 'gap-2',
    },
    lg: {
      icon: 'h-12 w-12',
      text: 'text-3xl',
      gap: 'gap-3',
    },
  }

  const { icon, text, gap } = sizeClasses[size]

  return (
    <div className={`flex items-center ${gap} ${className}`}>
      <div className="relative">
        <Users className={`${icon} text-blue-600 dark:text-blue-400`} />
        <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-80"></div>
      </div>
      {showText && (
        <span
          className={`bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold text-transparent dark:from-blue-400 dark:to-purple-400 ${text}`}
        >
          Council of Sages
        </span>
      )}
    </div>
  )
}
