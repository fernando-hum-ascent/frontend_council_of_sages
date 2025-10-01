import LandingHeader from '@/components/landing/LandingHeader'
import Hero from '@/components/landing/Hero'
import HowItWorks from '@/components/landing/HowItWorks'
import ExampleUse from '@/components/landing/ExampleUse'
import Benefits from '@/components/landing/Benefits'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-body">
      <LandingHeader />
      <Hero />
      <HowItWorks />
      <ExampleUse />
      <Benefits />
      <CTA />
      <Footer />
    </div>
  )
}
