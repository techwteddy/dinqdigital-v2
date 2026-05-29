import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  CreditCard,
  Settings,
  Users,
  Zap,
} from 'lucide-react'
import { ActivityChart } from '@/components/dashboard/activity-chart'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { MetricsGrid } from '@/components/dashboard/metrics-grid'
import { OnboardingChecklist } from '@/components/dashboard/onboarding-checklist'
import { OrgWorkspaceGrid } from '@/components/dashboard/org-workspace-grid'
import { QuickActionGrid } from '@/components/dashboard/quick-action-grid'
import { getDbUserWithMemberships, requireAuth } from '@/lib/auth'
import {
  buildActivityFromMemberships,
  buildChartFromMemberships,
  getDashboardStats,
  getOnboardingSteps,
} from '@/lib/dashboard-stats'
import { formatRelativeDate, isSubscriptionActive } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'

export const metadata: Metadata = { title: 'Dashboard' }

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default async function DashboardPage() {
  await requireAuth()
  const dbUser = await getDbUserWithMemberships()
  const memberships = dbUser?.memberships ?? []
  const firstName = dbUser?.name?.split(' ')[0] ?? 'there'
  const { metrics } = getDashboardStats(dbUser)
  const chartData = buildChartFromMemberships(memberships)
  const activity = buildActivityFromMemberships(memberships)
  const onboardingSteps = getOnboardingSteps(dbUser)

  const workspaces = memberships.map(({ organization: org, role }) => {
    const sub = org.subscription
    const active = sub ? isSubscriptionActive(sub.status) : false
    return {
      id: org.id,
      name: org.name,
      role: role.toLowerCase(),
      members: org.members.length,
      planLabel: active ? (sub?.plan?.name ?? 'Active') : 'Free',
      active,
      renewsLabel: sub
        ? `Renews ${formatRelativeDate(sub.currentPeriodEnd)}`
        : undefined,
    }
  })

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title={`${getGreeting()}, ${firstName}`}
        description="Your workspace overview — organizations, team activity, and quick actions."
      />

      <OnboardingChecklist steps={onboardingSteps} />

      {memberships.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center py-14 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Zap className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="mb-2">No organizations yet</CardTitle>
            <CardDescription className="mb-6 max-w-md">
              Create your first organization to unlock analytics, team
              management, billing, and shared settings.
            </CardDescription>
            <Button asChild>
              <Link href="/dashboard/settings">
                Create organization
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <MetricsGrid metrics={metrics} />

          <div className="grid gap-6 lg:grid-cols-3">
            <ActivityChart data={chartData} className="lg:col-span-2" />
            <ActivityFeed items={activity} viewAllHref="/dashboard/analytics" />
          </div>

          <OrgWorkspaceGrid workspaces={workspaces} />
        </>
      )}

      <QuickActionGrid
        actions={[
          {
            href: '/dashboard/analytics',
            label: 'Analytics',
            description: 'Growth and engagement insights',
            icon: BarChart3,
          },
          {
            href: '/dashboard/team',
            label: 'Team',
            description: 'Members and invitations',
            icon: Users,
          },
          {
            href: '/dashboard/billing',
            label: 'Billing',
            description: 'Plans and subscriptions',
            icon: CreditCard,
          },
          {
            href: '/dashboard/settings',
            label: 'Settings',
            description: 'Profile and organizations',
            icon: Settings,
          },
        ]}
      />
    </div>
  )
}
