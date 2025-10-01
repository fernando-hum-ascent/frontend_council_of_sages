import { Clock, Globe, Users2, Zap, Shield, Sparkles } from 'lucide-react'

const benefits = [
  {
    icon: Zap,
    title: 'Access diverse expert knowledge instantly',
    description:
      'No more searching through countless articles - get curated wisdom from the greatest minds in seconds',
  },
  {
    icon: Globe,
    title: 'Historical wisdom meets modern insights',
    description:
      'Combine timeless principles with contemporary understanding for well-rounded perspectives',
  },
  {
    icon: Users2,
    title: 'Personalized councils for every question',
    description:
      'Each question gets a uniquely assembled team of the most relevant experts and thinkers',
  },
  {
    icon: Sparkles,
    title: 'Multiple perspectives simultaneously',
    description:
      "Why settle for one viewpoint when you can have the collective wisdom of history's greatest minds",
  },
  {
    icon: Clock,
    title: 'Available 24/7',
    description:
      'Your personal council of advisors never sleeps - get expert guidance whenever inspiration strikes',
  },
  {
    icon: Shield,
    title: 'Trusted expertise',
    description:
      'Learn from figures who have shaped our world across centuries of human knowledge and achievement',
  },
]

const Benefits = () => {
  return (
    <section className="bg-card px-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-6 font-heading text-4xl font-bold text-foreground lg:text-5xl">
            Why Choose Council of Sages?
          </h2>
          <p className="mx-auto max-w-3xl font-body text-xl text-muted-foreground">
            Experience the power of having history's greatest minds as your
            personal advisors
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div key={index} className="group">
              <div className="h-full rounded-2xl border border-sage/10 bg-background p-8 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-sage/30 hover:shadow-elegant">
                <div className="mb-6 w-fit rounded-full bg-sage/10 p-4 transition-colors duration-300 group-hover:bg-sage/20">
                  <benefit.icon className="h-8 w-8 text-sage" />
                </div>

                <h3 className="mb-4 font-heading text-xl font-semibold text-foreground">
                  {benefit.title}
                </h3>

                <p className="font-body leading-relaxed text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Benefits
