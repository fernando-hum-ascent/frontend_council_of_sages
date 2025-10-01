import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()

  // Clean minimal layout for homepage and auth page (ChatGPT style)
  if (
    location.pathname === '/' ||
    location.pathname === '/auth' ||
    location.pathname === '/verify-email'
  ) {
    return (
      <div className="min-h-screen bg-background">
        <main>{children}</main>
      </div>
    )
  }

  // Sidebar-only layout for main app
  return (
    <div className="min-h-screen bg-background">
      <main>{children}</main>
    </div>
  )
}
