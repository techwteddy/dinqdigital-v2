import type { Metadata } from 'next'
import { CreditCard } from 'lucide-react'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { MetricsGrid } from '@/components/dashboard/metrics-grid'
import { Badge } from '@/components/ui/badge'
import { getAdminBillingSummary } from '@/lib/admin-billing'
import type { DashboardMetric } from '@/lib/dashboard-types'

export const metadata: Metadata = { title: 'Billing & Invoices' }

export default async function AdminBillingPage() {
  const { rows, totalMrr, activeSubscriptions, pendingPayments } =
    await getAdminBillingSummary()

  const metrics: DashboardMetric[] = [
    {
      label: 'Total MRR',
      value: totalMrr,
      change: 'From active subscriptions',
      up: activeSubscriptions > 0,
    },
    {
      label: 'Active Subscriptions',
      value: String(activeSubscriptions),
      change: 'Currently paying or trialing',
      up: activeSubscriptions > 0,
    },
    {
      label: 'Pending Payments',
      value: String(pendingPayments),
      change: 'Past due / incomplete / unpaid',
      up: false,
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Billing & Invoices"
        description="Stripe subscriptions synced through LaunchKit billing."
      />

      <MetricsGrid metrics={metrics} />

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 sm:px-5">Client</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3 sm:px-5">Next Billing Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-muted-foreground sm:px-5"
                >
                  <span className="inline-flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    No Stripe subscriptions yet.
                  </span>
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-muted/20"
                >
                  <td className="px-4 py-3.5 font-medium sm:px-5">
                    {row.client}
                  </td>
                  <td className="px-4 py-3.5">{row.plan}</td>
                  <td className="px-4 py-3.5">
                    <Badge
                      variant={row.active ? 'success' : 'secondary'}
                      className="capitalize"
                    >
                      {row.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 font-medium">{row.amount}</td>
                  <td className="px-4 py-3.5 text-muted-foreground sm:px-5">
                    {row.nextBillingDate}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
