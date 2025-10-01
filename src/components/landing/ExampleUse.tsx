import { TrendingUp, Brain, Briefcase, Atom } from 'lucide-react'
import businessExperts from '@/assets/business-experts.png'
import philosophyExperts from '@/assets/philosophy-experts.png'
import financeExperts from '@/assets/finance-experts.png'
import scienceExperts from '@/assets/science-experts.png'

const useCases = [
  {
    icon: TrendingUp,
    category: 'Finance Question',
    experts: ['Warren Buffett', 'Ray Dalio', 'Benjamin Graham'],
    color: 'from-muted/10 to-muted/20',
    image: financeExperts,
  },
  {
    icon: Brain,
    category: 'Philosophy Question',
    experts: ['Marcus Aurelius', 'Aristotle', 'Socrates'],
    color: 'from-muted/20 to-muted/10',
    image: philosophyExperts,
  },
  {
    icon: Briefcase,
    category: 'Business Strategy',
    experts: ['Steve Jobs', 'Peter Drucker', 'Jeff Bezos'],
    color: 'from-muted/10 to-muted/20',
    image: businessExperts,
  },
  {
    icon: Atom,
    category: 'Science Question',
    experts: ['Einstein', 'Carl Sagan', 'Marie Curie'],
    color: 'from-muted/20 to-muted/10',
    image: scienceExperts,
  },
]

const ExampleUse = () => {
  return (
    <section className="bg-background px-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-6 font-heading text-4xl font-bold text-foreground lg:text-5xl">
            Example Use Cases
          </h2>
          <p className="mx-auto max-w-3xl font-body text-xl text-muted-foreground">
            See how different questions automatically assemble the perfect
            council of experts
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {useCases.map((useCase, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-muted hover:shadow-elegant">
                <div className="mb-6">
                  <img
                    src={useCase.image}
                    alt={`${useCase.category} experts`}
                    className="h-20 w-full rounded-lg object-contain"
                  />
                </div>

                <h3 className="mb-4 font-heading text-xl font-semibold text-foreground">
                  {useCase.category}
                </h3>

                <div className="space-y-2">
                  <p className="mb-3 font-body text-sm text-muted-foreground">
                    Council example:
                  </p>
                  {useCase.experts.map((expert, expertIndex) => (
                    <div
                      key={expertIndex}
                      className="flex items-center space-x-2"
                    >
                      <div className="h-2 w-2 rounded-full bg-muted-foreground"></div>
                      <span className="font-body text-sm text-foreground">
                        {expert}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ExampleUse
