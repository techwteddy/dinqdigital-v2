import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionHeading } from '@/components/marketing/section-heading'
import { FEATURES } from '@/lib/marketing'

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-20 border-b border-border py-20 md:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="Features"
          title="Everything your team needs to move faster"
          description="Powerful capabilities out of the box — so you can focus on growth, not tooling."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                className="group border-border/80 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <CardHeader>
                  <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
