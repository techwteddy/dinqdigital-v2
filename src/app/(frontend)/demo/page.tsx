import { BarChart3, CreditCard, Settings, Users } from 'lucide-react'
import { DemoActivityChart } from '@/components/demo/demo-activity-chart'
import { DemoActivityFeed } from '@/components/demo/demo-activity-feed'
import { DemoMetricsGrid } from '@/components/demo/demo-metrics-grid'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { OrgWorkspaceGrid } from '@/components/dashboard/org-workspace-grid'
import { QuickActionGrid } from '@/components/dashboard/quick-action-grid'
import { DEMO_ORGANIZATIONS, DEMO_USER } from '@/lib/demo-data'

export default function DemoDashboardPage() {
  const firstName = DEMO_USER.name.split(' ')[0]

  const workspaces = DEMO_ORGANIZATIONS.map((org) => ({
    id: org.id,
    name: org.name,
    role: org.role,
    members: org.members,
    planLabel: org.plan,
    active: org.active,
    renewsLabel: `Renews in ${org.renewsIn}`,
  }))

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        isDemo
        title={`Good morning, ${firstName}`}
        description="Here's what's happening across your workspaces today — explore every feature without signing in."
        action={{ label: 'Start free trial', href: '/auth/register' }}
      />

      <DemoMetricsGrid />

      <div className="grid gap-6 lg:grid-cols-3">
        <DemoActivityChart />
        <DemoActivityFeed />
      </div>

      <OrgWorkspaceGrid workspaces={workspaces} />

      <QuickActionGrid
        actions={[
          {
            href: '/demo/analytics',
            label: 'Analytics',
            description: 'Traffic, conversion, and growth',
            icon: BarChart3,
          },
          {
            href: '/demo/team',
            label: 'Team',
            description: 'Members, roles, and invites',
            icon: Users,
          },
          {
            href: '/demo/billing',
            label: 'Billing',
            description: 'Plans, usage, and invoices',
            icon: CreditCard,
          },
          {
            href: '/demo/settings',
            label: 'Settings',
            description: 'Profile and preferences',
            icon: Settings,
          },
        ]}
      />
    </div>
  )
}
