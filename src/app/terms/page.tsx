import type { Metadata } from 'next'
import Link from 'next/link'
import { BrandLogo } from '@/components/brand/brand-logo'
import { APP_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms of service for ${APP_NAME}.`,
}

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="container flex h-16 items-center">
          <BrandLogo />
        </div>
      </header>
      <main className="container max-w-3xl py-16">
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
          <p className="text-muted-foreground leading-relaxed">
            These terms govern your use of {APP_NAME}. By using this application, you agree to
            these terms. Customize this page with your legal counsel before launching to customers.
          </p>
          <h2 className="mt-8 text-xl font-semibold">Use of service</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            You may use the service in compliance with applicable laws. You are responsible for
            your account credentials and all activity under your account.
          </p>
          <h2 className="mt-8 text-xl font-semibold">Subscriptions & billing</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Paid plans are billed in advance. You may cancel at any time; access continues until
            the end of the billing period unless otherwise stated.
          </p>
          <h2 className="mt-8 text-xl font-semibold">Contact</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Questions about these terms? Contact your support email configured in environment variables.
          </p>
        </div>

        <Link href="/" className="mt-12 inline-block text-sm font-medium text-primary hover:underline">
          ← Back to home
        </Link>
      </main>
    </div>
  )
}
