import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import councilLogo from '@/assets/council-logo-updated.png'

const Hero = () => {
  const navigate = useNavigate()

  const handleStartCouncil = () => {
    navigate('/auth')
  }

  const handleSeeHowItWorks = () => {
    const howItWorksSection = document.getElementById('how-it-works')
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4 py-20 pt-32">
      <div className="container mx-auto max-w-4xl">
        <div className="space-y-8 text-center">
          <div className="mb-6 flex justify-center">
            <img
              src={councilLogo}
              alt="Council of Sages Logo"
              className="h-24 w-auto opacity-90"
            />
          </div>

          <div className="space-y-6">
            <h1 className="font-heading text-5xl font-bold leading-tight text-foreground lg:text-6xl">
              Get Wisdom from{' '}
              <span className="text-foreground">History's Greatest Minds</span>
            </h1>

            <p className="mx-auto max-w-2xl font-body text-xl leading-relaxed text-muted-foreground lg:text-2xl">
              Ask any question and get answers from a custom-assembled council
              of AI experts and historical figures
            </p>
          </div>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              onClick={handleStartCouncil}
              variant="sage"
              size="lg"
              className="h-auto px-8 py-6 text-lg"
            >
              Start Your Council
            </Button>

            <Button
              onClick={handleSeeHowItWorks}
              variant="elegant"
              size="lg"
              className="h-auto px-8 py-6 font-body text-lg"
            >
              See How It Works
            </Button>
          </div>

          <div className="space-y-2 pt-4">
            <p className="font-body text-sm text-muted-foreground">
              ✨ Access diverse expert knowledge instantly
            </p>
            <p className="font-body text-sm text-muted-foreground">
              🕰️ Historical wisdom meets modern insights
            </p>
            <p className="font-body text-sm text-muted-foreground">
              🎯 Personalized councils for every question
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
