import { Menu } from 'lucide-react'

interface SidebarToggleProps {
  onClick: () => void
  className?: string
}

export function SidebarToggle({ onClick, className = '' }: SidebarToggleProps) {
  return (
    <button
      onClick={onClick}
      className={`flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 ${className}`}
      aria-label="Open sidebar"
    >
      <Menu
        style={{
          width: '20px',
          height: '20px',
          minWidth: '20px',
          minHeight: '20px',
        }}
      />
    </button>
  )
}
