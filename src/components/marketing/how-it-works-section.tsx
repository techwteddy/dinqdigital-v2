import { SectionHeading } from '@/components/marketing/section-heading'
import { STEPS } from '@/lib/marketing'

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-b border-border bg-muted/30 py-20 md:py-28"
    >
      <div className="container">
        <SectionHeading
          eyebrow="How it works"
          title="Up and running in three simple steps"
          description="Get your team onboarded quickly and start seeing results from day one."
        />

        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.step} className="relative rounded-xl border border-border bg-card p-6 shadow-sm">
                <span className="text-4xl font-bold text-primary/20">{step.step}</span>
                <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
