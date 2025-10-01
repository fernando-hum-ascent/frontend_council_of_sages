import councilLogo from '@/assets/council-logo-updated.png'

const Footer = () => {
  return (
    <footer className="bg-warm-gray px-4 py-12 text-warm-white">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-8 flex items-center space-x-4 md:mb-0">
            <img
              src={councilLogo}
              alt="Council of Sages"
              className="h-12 w-auto opacity-90"
            />
            <div>
              <h3 className="font-heading text-xl font-semibold">
                Council of Sages
              </h3>
              <p className="font-body text-sm text-warm-white/70">
                Wisdom from History's Greatest Minds
              </p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="mb-2 font-body text-sm text-warm-white/70">
              © 2025 Council of Sages. All rights reserved.
            </p>
            <p className="font-body text-xs text-warm-white/50">
              Bringing timeless wisdom to the modern world
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
