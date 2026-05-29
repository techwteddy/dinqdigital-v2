import Link from 'next/link'
import { Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { SectionHeading } from '@/components/marketing/section-heading'
import { PLANS } from '@/lib/marketing'
import { cn } from '@/lib/utils'

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="scroll-mt-20 border-b border-border py-20 md:py-28"
    >
      <div className="container">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple, transparent pricing"
          description="Start with a 14-day free trial on every plan. Upgrade when you are ready — no hidden fees."
        />

        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                'relative flex flex-col',
                plan.highlighted &&
                  'border-primary shadow-xl shadow-primary/10 ring-1 ring-primary lg:scale-[1.02]'
              )}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-muted-foreground">
                      {plan.period}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? 'default' : 'outline'}
                  asChild
                >
                  {plan.href.startsWith('mailto:') ? (
                    <a href={plan.href}>{plan.cta}</a>
                  ) : (
                    <Link href={plan.href}>{plan.cta}</Link>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
