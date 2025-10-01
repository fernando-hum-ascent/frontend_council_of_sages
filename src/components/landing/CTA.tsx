import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const CTA = () => {
  const navigate = useNavigate()

  const handleStartCouncil = () => {
    navigate('/auth')
  }

  return (
    <section className="bg-gradient-to-br from-muted/10 to-muted/5 px-4 py-20">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="rounded-3xl bg-warm-white/95 p-12 shadow-elegant backdrop-blur">
          <h2 className="mb-6 font-heading text-4xl font-bold text-warm-gray lg:text-5xl">
            Ready to Consult the Sages?
          </h2>

          <p className="mx-auto mb-8 max-w-2xl font-body text-xl text-warm-gray/80">
            Start getting personalized wisdom from history's greatest minds.
            Join Council of Sages and experience the power of collective
            intelligence.
          </p>

          <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              onClick={handleStartCouncil}
              variant="sage"
              size="lg"
              className="group h-12 px-8 text-lg"
            >
              Start Your Council Now
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-warm-gray/60">
            <span className="flex items-center">
              ✨ Instant access to wisdom
            </span>
            <span className="flex items-center">🚀 No waiting required</span>
            <span className="flex items-center">🎯 Personalized for you</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA
