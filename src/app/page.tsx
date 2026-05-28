import Link from 'next/link'
import { ArrowRight, Check, Github, Star, Zap } from 'lucide-react'

const FEATURES = [
  {
    icon: '🔐',
    title: 'Authentication',
    description:
      'Email/password, magic links, Google & GitHub OAuth — all wired up via Supabase Auth with SSR-safe cookies.',
  },
  {
    icon: '🏢',
    title: 'Multi-tenancy',
    description:
      'Organizations, role-based access (Admin/Member), and team invitations out of the box.',
  },
  {
    icon: '💳',
    title: 'Stripe Billing',
    description:
      'Checkout sessions, subscription management, webhooks, and billing portal — fully integrated.',
  },
  {
    icon: '🗄️',
    title: 'Type-safe Database',
    description:
      'PostgreSQL via Supabase + Prisma ORM. Auto-generated types. Zero runtime surprises.',
  },
  {
    icon: '🛡️',
    title: 'Route Protection',
    description:
      'Middleware-based auth guards. Protected and public routes just work — no boilerplate per page.',
  },
  {
    icon: '📦',
    title: 'DX First',
    description:
      'ESLint, Prettier, Husky, lint-staged, and GitHub Actions CI — all configured and ready.',
  },
]

const PLANS = [
  {
    name: 'Starter',
    price: '$9',
    period: '/mo',
    description: 'Perfect for indie hackers.',
    features: ['1 Organization', 'Up to 3 Members', '5GB Storage', 'Email Support'],
    cta: 'Get started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    description: 'For growing startups.',
    features: [
      '3 Organizations',
      'Up to 25 Members',
      '50GB Storage',
      'Priority Support',
      'API Access',
      'Custom Domain',
    ],
    cta: 'Start free trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/mo',
    description: 'For large teams.',
    features: [
      'Unlimited Everything',
      'Dedicated Support',
      'Custom Integrations',
      'SSO / SAML',
      'SLA',
    ],
    cta: 'Contact us',
    highlighted: false,
  },
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ─── Nav ─── */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-xl tracking-tight">
            <Zap className="h-5 w-5 text-primary" />
            LaunchKit
          </div>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link href="#features" className="transition-colors hover:text-foreground">Features</Link>
            <Link href="#pricing" className="transition-colors hover:text-foreground">Pricing</Link>
            <Link href="https://github.com/OmarSharaf/launchkit" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">Docs</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="https://github.com/OmarSharaf/launchkit"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:flex"
            >
              <Github className="h-4 w-4" />
              <span>Star on GitHub</span>
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ─── Hero ─── */}
        <section className="container flex flex-col items-center gap-6 py-24 text-center md:py-36">
          <Link
            href="https://github.com/OmarSharaf/launchkit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Star className="h-3 w-3" />
            Open Source — Star us on GitHub
            <ArrowRight className="h-3 w-3" />
          </Link>

          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-7xl">
            Ship your SaaS{' '}
            <span className="gradient-text">in days,</span>
            <br />
            not months.
          </h1>

          <p className="max-w-xl text-lg text-muted-foreground sm:text-xl">
            LaunchKit is a production-ready SaaS boilerplate with everything
            you need — auth, billing, multi-tenancy, and a clean codebase — so
            you can focus on what makes your product unique.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/auth/register"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
            >
              Start building free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="https://github.com/OmarSharaf/launchkit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-background px-6 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-accent hover:shadow-md"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {['MIT License', 'TypeScript', 'Next.js 15', 'No vendor lock-in'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-primary" />
                {item}
              </span>
            ))}
          </div>
        </section>

        {/* ─── Features ─── */}
        <section id="features" className="border-t border-border bg-muted/30 py-24">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything included. Nothing to figure out.
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Every feature a modern SaaS needs, built, tested, and ready to ship.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-3 text-3xl">{feature.icon}</div>
                  <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Pricing ─── */}
        <section id="pricing" className="py-24">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Simple, transparent pricing
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Start free, upgrade when you're ready. All plans include a 14-day trial.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-xl border p-6 shadow-sm ${
                    plan.highlighted
                      ? 'border-primary bg-primary text-primary-foreground shadow-lg scale-105'
                      : 'border-border bg-card text-card-foreground'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-foreground px-3 py-1 text-xs font-semibold text-primary">
                      Most Popular
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="font-bold text-xl">{plan.name}</h3>
                    <p className={`mt-1 text-sm ${plan.highlighted ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {plan.description}
                    </p>
                  </div>
                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className={`text-sm ${plan.highlighted ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {plan.period}
                    </span>
                  </div>
                  <ul className="mb-6 space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className={`h-4 w-4 shrink-0 ${plan.highlighted ? 'text-primary-foreground' : 'text-primary'}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/auth/register"
                    className={`block w-full rounded-md py-2.5 text-center text-sm font-semibold transition-colors ${
                      plan.highlighted
                        ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="border-t border-border bg-muted/30 py-24">
          <div className="container flex flex-col items-center gap-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to launch faster?
            </h2>
            <p className="max-w-md text-lg text-muted-foreground">
              Clone the repo, add your keys, and you're live. The hard parts are already done.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/auth/register"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
              >
                Start building free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="https://github.com/OmarSharaf/launchkit"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-background px-6 text-sm font-semibold transition-all hover:bg-accent"
              >
                <Github className="h-4 w-4" />
                View Source
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border py-8">
        <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <Zap className="h-4 w-4 text-primary" />
            LaunchKit
          </div>
          <p>
            Built by{' '}
            <Link
              href="https://www.omarsharaf.me"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Omar S. M. Abdelfatah
            </Link>{' '}
            · MIT License
          </p>
          <div className="flex items-center gap-4">
            <Link href="https://github.com/OmarSharaf/launchkit" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
              GitHub
            </Link>
            <Link href="https://www.linkedin.com/in/omarsharafaldin/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
              LinkedIn
            </Link>
            <Link href="https://www.omarsharaf.me" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
              Website
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
