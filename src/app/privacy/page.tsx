import type { Metadata } from 'next'
import Link from 'next/link'
import { BrandLogo } from '@/components/brand/brand-logo'
import { APP_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy policy for ${APP_NAME}.`,
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="container flex h-16 items-center">
          <BrandLogo />
        </div>
      </header>
      <main className="container max-w-3xl py-16">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-muted-foreground">
          Last updated:{' '}
          {new Date().toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </p>

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-xl font-semibold">Information we collect</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              We collect account information you provide (such as name and
              email), usage data, and payment information processed by Stripe.
              Authentication is handled via Supabase.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">How we use data</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Data is used to provide and improve {APP_NAME}, process
              transactions, send transactional emails, and comply with legal
              obligations. Replace this section with your actual practices.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">Your rights</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Depending on your region, you may request access, correction, or
              deletion of your personal data by contacting support.
            </p>
          </section>
        </div>

        <Link
          href="/"
          className="mt-12 inline-block text-sm font-medium text-primary hover:underline"
        >
          ← Back to home
        </Link>
      </main>
    </div>
  )
}
