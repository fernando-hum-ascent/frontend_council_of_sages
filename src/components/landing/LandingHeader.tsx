import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import councilLogo from '@/assets/council-logo-updated.png'

const LandingHeader = () => {
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate('/auth')
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src={councilLogo}
              alt="Council of Sages Logo"
              className="h-8 w-auto opacity-90"
            />
            <span className="hidden font-heading text-xl font-bold text-foreground sm:block">
              Council of Sages
            </span>
          </div>

          {/* Login Button */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleLogin}
              variant="sage"
              size="sm"
              className="font-body"
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default LandingHeader
