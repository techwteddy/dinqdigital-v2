import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ClipboardList,
  ExternalLink,
  ListChecks,
  Receipt,
  Users,
} from 'lucide-react'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { MetricsGrid } from '@/components/dashboard/metrics-grid'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  formatAdminDate,
  getActiveClientsCount,
  getFormSubmissions,
  getOpenDealsCount,
  getSubmissionField,
} from '@/lib/admin'
import { countPortalUsers } from '@/lib/admin-users'
import type { DashboardActivityItem, DashboardMetric } from '@/lib/dashboard-types'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = { title: 'Admin' }

const QUICK_ACTIONS = [
  {
    label: 'Payload CMS',
    href: '/cms',
    external: true,
    icon: ExternalLink,
  },
  {
    label: 'Form Submissions',
    href: '/cms/collections/form-submissions',
    external: true,
    icon: ClipboardList,
  },
  {
    label: 'Manage Clients',
    href: '/cms/collections/clients',
    external: true,
    icon: Users,
  },
  {
    label: 'Create Invoice',
    href: '/admin/invoices',
    external: false,
    icon: Receipt,
  },
  {
    label: 'Create Task',
    href: '/admin/tasks',
    external: false,
    icon: ListChecks,
  },
] as const

export default async function AdminOverviewPage() {
  const [
    submissions,
    activeClients,
    openDeals,
    portalSignups,
    totalMessages,
    openTickets,
    pendingInvoices,
  ] = await Promise.all([
    getFormSubmissions(5),
    getActiveClientsCount(),
    getOpenDealsCount(),
    countPortalUsers().catch(() => 0),
    prisma.message.count().catch(() => 0),
    prisma.supportTicket.count({ where: { status: 'open' } }).catch(() => 0),
    prisma.invoice.count({ where: { status: 'pending' } }).catch(() => 0),
  ])

  const metrics: DashboardMetric[] = [
    {
      label: 'Total Quotes',
      value: String(submissions.totalDocs),
      change: 'Form submissions',
      up: submissions.totalDocs > 0,
    },
    {
      label: 'Active Clients',
      value: String(activeClients),
      change: 'Status = active',
      up: activeClients > 0,
    },
    {
      label: 'Open Deals',
      value: String(openDeals),
      change: 'Pending + Contacting',
      up: openDeals > 0,
    },
    {
      label: 'Revenue',
      value: '$0',
      change: 'Stripe — coming soon',
      up: false,
    },
    {
      label: 'Total Portal Signups',
      value: String(portalSignups),
      change: 'Supabase auth users',
      up: portalSignups > 0,
    },
    {
      label: 'Total Messages',
      value: String(totalMessages),
      change: 'All conversations',
      up: totalMessages > 0,
    },
    {
      label: 'Total Open Tickets',
      value: String(openTickets),
      change: 'Support status = open',
      up: openTickets > 0,
    },
    {
      label: 'Total Pending Invoices',
      value: String(pendingInvoices),
      change: 'Invoice status = pending',
      up: pendingInvoices > 0,
    },
  ]

  const activity: DashboardActivityItem[] = submissions.docs.map(
    (submission) => {
      const name = getSubmissionField(submission, 'full-name')
      const email = getSubmissionField(submission, 'email')
      const budget = getSubmissionField(submission, 'budget-tier')

      return {
        id: String(submission.id),
        action: `${name} · ${budget}`,
        user: email,
        time: formatAdminDate(submission.createdAt),
        type: 'info' as const,
      }
    }
  )

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Good morning, Ted"
        description="Here's your agency overview"
      />

      <MetricsGrid metrics={metrics} />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.href}
                asChild
                variant="outline"
                size="sm"
                className="gap-2"
              >
                {action.external ? (
                  <a
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="h-4 w-4" />
                    {action.label}
                  </a>
                ) : (
                  <Link href={action.href}>
                    <Icon className="h-4 w-4" />
                    {action.label}
                  </Link>
                )}
              </Button>
            )
          })}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityFeed
            items={
              activity.length > 0
                ? activity
                : [
                    {
                      id: 'empty',
                      action: 'No quote submissions yet',
                      user: 'Waiting for the first Start a Project form',
                      time: '—',
                      type: 'warning',
                    },
                  ]
            }
            viewAllHref="/admin/quotes"
          />
        </div>
      </div>
    </div>
  )
}
