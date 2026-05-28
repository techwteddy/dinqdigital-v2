import type { Metadata } from 'next'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatRelativeDate, isSubscriptionActive } from '@/lib/utils'
import Link from 'next/link'
import { ArrowRight, CreditCard, Users, Zap } from 'lucide-react'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const user = await requireAuth()

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      memberships: {
        include: {
          organization: {
            include: {
              subscription: { include: { plan: true } },
              members: true,
            },
          },
        },
      },
    },
  })

  const memberships = dbUser?.memberships ?? []

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {dbUser?.name?.split(' ')[0] ?? 'there'} 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s an overview of your organizations.
        </p>
      </div>

      {memberships.length === 0 ? (
        /* Empty state */
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <Zap className="mx-auto mb-4 h-10 w-10 text-muted-foreground/50" />
          <h2 className="mb-2 font-semibold">No organizations yet</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Create your first organization to get started.
          </p>
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Create organization
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {memberships.map(({ organization: org, role }) => {
            const sub = org.subscription
            const active = sub ? isSubscriptionActive(sub.status) : false

            return (
              <div
                key={org.id}
                className="rounded-xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
                    {org.name[0].toUpperCase()}
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    active
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {active ? sub?.plan?.name ?? 'Active' : 'Free'}
                  </span>
                </div>
                <h3 className="mb-1 font-semibold">{org.name}</h3>
                <p className="text-xs text-muted-foreground">
                  Role: <span className="capitalize">{role.toLowerCase()}</span>
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {org.members.length} member{org.members.length !== 1 ? 's' : ''}
                  </span>
                  {sub && (
                    <span className="flex items-center gap-1">
                      <CreditCard className="h-3.5 w-3.5" />
                      Renews {formatRelativeDate(sub.currentPeriodEnd)}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2 className="mb-3 font-semibold">Quick actions</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/dashboard/billing"
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-sm transition-colors hover:bg-accent"
          >
            <CreditCard className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Manage billing</p>
              <p className="text-xs text-muted-foreground">Upgrade or manage your subscription</p>
            </div>
            <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-sm transition-colors hover:bg-accent"
          >
            <Users className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Invite team members</p>
              <p className="text-xs text-muted-foreground">Grow your organization</p>
            </div>
            <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </div>
  )
}
