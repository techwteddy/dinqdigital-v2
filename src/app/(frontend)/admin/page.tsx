import type { Metadata } from 'next'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { MetricsGrid } from '@/components/dashboard/metrics-grid'
import {
  formatAdminDate,
  getActiveClientsCount,
  getFormSubmissions,
  getOpenDealsCount,
  getSubmissionField,
} from '@/lib/admin'
import type { DashboardActivityItem, DashboardMetric } from '@/lib/dashboard-types'

export const metadata: Metadata = { title: 'Admin' }

export default async function AdminOverviewPage() {
  const [submissions, activeClients, openDeals] = await Promise.all([
    getFormSubmissions(5),
    getActiveClientsCount(),
    getOpenDealsCount(),
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
