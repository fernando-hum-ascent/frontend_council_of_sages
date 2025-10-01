import { MessageSquare, Users, Lightbulb } from 'lucide-react'

const steps = [
  {
    icon: MessageSquare,
    title: 'Ask Your Question',
    description:
      'Type any doubt you have - from complex philosophy to practical business advice',
    number: '01',
  },
  {
    icon: Users,
    title: 'AI Assembles Your Council',
    description:
      'Our algorithm selects the most relevant expert personalities for your specific question',
    number: '02',
  },
  {
    icon: Lightbulb,
    title: 'Get Multiple Expert Perspectives',
    description:
      'Receive diverse, knowledgeable answers from your custom council of minds',
    number: '03',
  },
]

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-card px-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-6 font-heading text-4xl font-bold text-foreground lg:text-5xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl font-body text-xl text-muted-foreground">
            Three simple steps to access the collective wisdom of history's
            greatest minds
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="group text-center">
                <div className="relative mb-6">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sage/10 transition-colors duration-300 group-hover:bg-sage/20">
                    <Icon className="h-10 w-10 text-sage" />
                  </div>
                  <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-sage font-heading text-sm font-bold text-warm-white">
                    {step.number}
                  </div>
                </div>

                <h3 className="mb-4 font-heading text-2xl font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="font-body text-lg leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
