'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, type ComponentType } from 'react'
import {
  ArrowLeft,
  BarChart3,
  Briefcase,
  CheckSquare,
  ClipboardList,
  CreditCard,
  FileText,
  FolderOpen,
  Globe,
  Handshake,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Palette,
  Receipt,
  Search,
  Settings,
  Shield,
  Users,
  X,
} from 'lucide-react'
import { BrandLogo } from '@/components/brand/brand-logo'
import { DashboardNotifications } from '@/components/dashboard/dashboard-notifications'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { NotificationBell } from '@/components/notifications/notification-bell'
import { Button } from '@/components/ui/button'
import { DEMO_NOTIFICATIONS } from '@/lib/demo-data'
import { cn } from '@/lib/utils'

type BasePath = '/dashboard' | '/demo' | '/admin'

type NavItem = {
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
  exact: boolean
  external?: boolean
}

function getNavItems(basePath: BasePath): NavItem[] {
  if (basePath === '/admin') {
    return [
      { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
      {
        href: '/admin/quotes',
        label: 'Quotes',
        icon: FileText,
        exact: false,
      },
      {
        href: '/admin/clients',
        label: 'Clients',
        icon: Users,
        exact: false,
      },
      {
        href: '/admin/messages',
        label: 'Messages',
        icon: MessageSquare,
        exact: false,
      },
      {
        href: '/admin/projects',
        label: 'Projects',
        icon: Briefcase,
        exact: false,
      },
      {
        href: '/admin/tasks',
        label: 'Tasks',
        icon: CheckSquare,
        exact: false,
      },
      {
        href: '/admin/support',
        label: 'Support',
        icon: LifeBuoy,
        exact: false,
      },
      {
        href: '/admin/invoices',
        label: 'Invoices',
        icon: Receipt,
        exact: false,
      },
      {
        href: '/admin/deals',
        label: 'Deals',
        icon: Handshake,
        exact: false,
      },
      {
        href: '/admin/billing',
        label: 'Billing',
        icon: CreditCard,
        exact: false,
      },
      {
        href: '/admin/files',
        label: 'Files',
        icon: Package,
        exact: false,
      },
    ]
  }

  if (basePath === '/dashboard') {
    return [
      { href: basePath, label: 'Overview', icon: LayoutDashboard, exact: true },
      {
        href: `${basePath}/projects`,
        label: 'Projects',
        icon: Briefcase,
        exact: false,
      },
      {
        href: 'https://dinqdigital.com/cms',
        label: 'Manage Website',
        icon: Globe,
        exact: false,
        external: true,
      },
      {
        href: `${basePath}/tasks`,
        label: 'Tasks',
        icon: CheckSquare,
        exact: false,
      },
      {
        href: `${basePath}/files`,
        label: 'Files',
        icon: FolderOpen,
        exact: false,
      },
      {
        href: `${basePath}/messages`,
        label: 'Messages',
        icon: MessageSquare,
        exact: false,
      },
      {
        href: `${basePath}/requests`,
        label: 'Requests',
        icon: ClipboardList,
        exact: false,
      },
      {
        href: `${basePath}/support`,
        label: 'Support',
        icon: LifeBuoy,
        exact: false,
      },
      {
        href: `${basePath}/brand`,
        label: 'Brand Kit',
        icon: Palette,
        exact: false,
      },
      {
        href: `${basePath}/analytics`,
        label: 'Analytics',
        icon: BarChart3,
        exact: false,
      },
      {
        href: `${basePath}/team`,
        label: 'Team',
        icon: Users,
        exact: false,
      },
      {
        href: `${basePath}/billing`,
        label: 'Billing',
        icon: CreditCard,
        exact: false,
      },
      {
        href: `${basePath}/invoices`,
        label: 'Invoices',
        icon: Receipt,
        exact: false,
      },
      {
        href: `${basePath}/settings`,
        label: 'Settings',
        icon: Settings,
        exact: false,
      },
    ]
  }

  return [
    { href: basePath, label: 'Overview', icon: LayoutDashboard, exact: true },
    {
      href: `${basePath}/analytics`,
      label: 'Analytics',
      icon: BarChart3,
      exact: false,
    },
    {
      href: `${basePath}/team`,
      label: 'Team',
      icon: Users,
      exact: false,
    },
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
  ]
}

interface DashboardShellProps {
  children: React.ReactNode
  userName: string
  userEmail: string
  orgName?: string
  planName?: string
  basePath?: BasePath
  isDemo?: boolean
  showAdminLink?: boolean
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
  showAdminLink = false,
  signOutAction,
}: DashboardShellProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const initials =
    userName[0]?.toUpperCase() ?? userEmail[0]?.toUpperCase() ?? 'U'
  const navItems: NavItem[] = [
    ...getNavItems(basePath),
    ...(showAdminLink
      ? [
          {
            href: '/admin',
            label: 'Admin',
            icon: Shield,
            exact: false,
          } satisfies NavItem,
        ]
      : []),
  ]

  const sidebar = (
    <>
      <div className="flex h-16 items-center border-b border-border px-4">
        <BrandLogo size="sm" href={isDemo ? '/' : '/'} />
      </div>

      {orgName && (
        <div className="border-b border-border bg-muted/20 px-4 py-3">
          <p className="truncate text-sm font-semibold">{orgName}</p>
          <p className="text-xs text-muted-foreground">
            {planName ?? 'Free'} plan
            {isDemo && ' · Preview'}
          </p>
        </div>
      )}

      <nav className="flex-1 space-y-0.5 p-3" aria-label="Dashboard">
        {navItems.map(({ href, label, icon: Icon, exact, external }) => {
          const active = external
            ? false
            : exact
              ? pathname === href
              : pathname.startsWith(href)
          return (
            <Link
              key={`${label}-${href}`}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary/10 text-primary shadow-sm'
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
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-600 text-sm font-semibold text-primary-foreground shadow-sm">
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

  const topBarExtras = (
    <>
      <Button
        variant="outline"
        size="sm"
        className="hidden gap-2 text-muted-foreground lg:flex"
        type="button"
        aria-label="Search dashboard"
      >
        <Search className="h-4 w-4" />
        <span className="text-xs">Search…</span>
        <kbd className="pointer-events-none ml-2 hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium sm:inline">
          ⌘K
        </kbd>
      </Button>
      <DashboardNotifications items={DEMO_NOTIFICATIONS} />
      <ThemeToggle />
    </>
  )

  const liveTopBarExtras = (
    <>
      <Button
        variant="outline"
        size="sm"
        className="hidden gap-2 text-muted-foreground lg:flex"
        type="button"
        aria-label="Search dashboard"
      >
        <Search className="h-4 w-4" />
        <span className="text-xs">Search…</span>
        <kbd className="pointer-events-none ml-2 hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium sm:inline">
          ⌘K
        </kbd>
      </Button>
      <NotificationBell />
      <ThemeToggle />
    </>
  )

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 flex-col border-r border-border bg-card/50 backdrop-blur md:flex">
        {sidebar}
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-2 border-b border-border bg-card/50 px-4 backdrop-blur md:hidden">
          <BrandLogo size="sm" href={isDemo ? '/' : '/'} />
          <div className="flex items-center gap-1">
            {isDemo ? (
              <DashboardNotifications items={DEMO_NOTIFICATIONS} />
            ) : (
              <NotificationBell />
            )}
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
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
          <div className="flex max-h-[min(70vh,calc(100vh-4rem))] flex-col overflow-y-auto border-b border-border bg-card md:hidden">
            {sidebar}
          </div>
        )}

        <div className="hidden h-16 items-center justify-between gap-4 border-b border-border bg-card/30 px-6 md:flex">
          <div className="min-w-0">
            {isDemo ? (
              <p className="truncate text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Live demo</span>
                {' — '}
                explore the full dashboard without signing in
              </p>
            ) : basePath === '/admin' ? (
              <p className="truncate text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {orgName ?? 'Agency'}
                </span>
                {' · '}
                Admin panel
              </p>
            ) : (
              <p className="truncate text-sm text-muted-foreground">
                {orgName ? (
                  <>
                    <span className="font-medium text-foreground">
                      {orgName}
                    </span>
                    {' · '}
                    {planName ?? 'Free'} plan
                  </>
                ) : (
                  'Complete setup in Settings to unlock all features'
                )}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {isDemo ? topBarExtras : liveTopBarExtras}
          </div>
        </div>

        <main className="flex-1 overflow-auto bg-gradient-to-b from-muted/20 to-background">
          <div className="container max-w-6xl py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
