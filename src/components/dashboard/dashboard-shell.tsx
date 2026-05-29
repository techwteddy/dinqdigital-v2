'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  ArrowLeft,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  X,
} from 'lucide-react'
import { BrandLogo } from '@/components/brand/brand-logo'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type BasePath = '/dashboard' | '/demo'

function getNavItems(basePath: BasePath) {
  return [
    { href: basePath, label: 'Overview', icon: LayoutDashboard, exact: true },
    {
      href: `${basePath}/billing`,
      label: 'Billing',
      icon: CreditCard,
      exact: false,
    },
    {
      href: `${basePath}/settings`,
      label: 'Settings',
      icon: Settings,
      exact: false,
    },
  ] as const
}

interface DashboardShellProps {
  children: React.ReactNode
  userName: string
  userEmail: string
  orgName?: string
  planName?: string
  basePath?: BasePath
  isDemo?: boolean
  signOutAction?: () => Promise<void>
}

export function DashboardShell({
  children,
  userName,
  userEmail,
  orgName,
  planName,
  basePath = '/dashboard',
  isDemo = false,
  signOutAction,
}: DashboardShellProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const initials =
    userName[0]?.toUpperCase() ?? userEmail[0]?.toUpperCase() ?? 'U'
  const navItems = getNavItems(basePath)

  const sidebar = (
    <>
      <div className="flex h-16 items-center border-b border-border px-4">
        <BrandLogo size="sm" href={isDemo ? '/' : '/'} />
      </div>

      {orgName && (
        <div className="border-b border-border px-4 py-3">
          <p className="truncate text-sm font-medium">{orgName}</p>
          <p className="text-xs text-muted-foreground">
            {planName ?? 'Free'} plan
          </p>
        </div>
      )}

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{userName}</p>
            <p className="truncate text-xs text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </div>
        {isDemo ? (
          <Link
            href="/"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Exit demo
          </Link>
        ) : (
          signOutAction && (
            <form action={signOutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </form>
          )
        )}
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 flex-col border-r border-border bg-card md:flex">
        {sidebar}
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card/50 px-4 md:hidden">
          <BrandLogo size="sm" href={isDemo ? '/' : '/'} />
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </header>

        {mobileOpen && (
          <div className="flex max-h-[calc(100vh-4rem)] flex-col border-b border-border bg-card md:hidden">
            {sidebar}
          </div>
        )}

        <div className="hidden h-16 items-center justify-between gap-2 border-b border-border px-6 md:flex">
          {isDemo && (
            <p className="text-sm text-muted-foreground">
              Preview mode — sample data only
            </p>
          )}
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>

        <main className="flex-1 overflow-auto">
          <div className="container max-w-6xl py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
