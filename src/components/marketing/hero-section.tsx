import Link from 'next/link'
import { ArrowRight, Check, Play, Sparkles } from 'lucide-react'
import { HeroVisual } from '@/components/marketing/hero-visual'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { APP_NAME, DEMO_DASHBOARD_PATH, PRODUCT_CATEGORY } from '@/lib/site'

const HERO_HEADLINE =
  'The smarter way to build, launch, and grow your business.'
const HERO_SUBTEXT =
  'We help modern businesses build premium websites, deploy AI agents, and manage operations — all in one ecosystem.'

const TRUST_ITEMS = [
  'Custom built',
  'No templates',
  'AI powered',
  'Client portal included',
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="mesh-gradient absolute inset-0" aria-hidden />
      <div className="grid-pattern absolute inset-0 opacity-30" aria-hidden />
      <div
        className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute bottom-10 right-1/4 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl"
        aria-hidden
      />

      <div className="container relative py-20 md:py-28 lg:py-32">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1">
            <Sparkles className="h-3 w-3 text-primary" />
            {PRODUCT_CATEGORY}
          </Badge>

          <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {HERO_HEADLINE.replace(/\.$/, '')}
            <span className="gradient-text">.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {HERO_SUBTEXT}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/auth/register">
                Start a Project
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={DEMO_DASHBOARD_PATH}>
                <Play className="h-4 w-4" />
                View live demo
              </Link>
            </Button>
          </div>

          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {TRUST_ITEMS.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <HeroVisual />

        <p className="mx-auto mt-8 max-w-lg text-center text-xs text-muted-foreground">
          Trusted by businesses who run on {APP_NAME}. Explore the platform
          before you commit.
        </p>
      </div>
    </section>
  )
}
