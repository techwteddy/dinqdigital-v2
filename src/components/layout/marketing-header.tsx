'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, Play, X } from 'lucide-react'
import { BrandLogo } from '@/components/brand/brand-logo'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { Button } from '@/components/ui/button'
import { NAV_LINKS } from '@/lib/marketing'
import { DEMO_DASHBOARD_PATH } from '@/lib/site'
import { cn } from '@/lib/utils'

export function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="glass sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <BrandLogo />

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            className="hidden gap-1.5 sm:inline-flex"
            asChild
          >
            <Link href={DEMO_DASHBOARD_PATH}>
              <Play className="h-3.5 w-3.5" />
              Live demo
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
            asChild
          >
            <Link href="/auth/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth/register">Start free trial</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          'border-t border-border/60 md:hidden',
          mobileOpen ? 'block' : 'hidden'
        )}
      >
        <nav className="container flex flex-col gap-1 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={DEMO_DASHBOARD_PATH}
            onClick={() => setMobileOpen(false)}
            className="rounded-md px-3 py-2.5 text-sm font-medium text-primary"
          >
            View live demo
          </Link>
          <Link
            href="/auth/login"
            onClick={() => setMobileOpen(false)}
            className="rounded-md px-3 py-2.5 text-sm font-medium"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  )
}
