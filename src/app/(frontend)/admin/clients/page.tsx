import type { Metadata } from 'next'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { Badge } from '@/components/ui/badge'
import { formatPlanLabel, getClients } from '@/lib/admin'

export const metadata: Metadata = { title: 'Clients' }

const STATUS_VARIANT = {
  active: 'success',
  paused: 'secondary',
  completed: 'outline',
} as const

export default async function AdminClientsPage() {
  const { docs } = await getClients(100)

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Clients"
        description="Agency clients managed in Payload."
        action={{ label: 'Add Client', href: '/cms/collections/clients/create' }}
      />

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 sm:px-5">Company Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3 sm:px-5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {docs.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-muted-foreground sm:px-5"
                >
                  No clients yet. Add your first client to get started.
                </td>
              </tr>
            ) : (
              docs.map((client) => {
                const status = client.status ?? 'active'
                const variant =
                  STATUS_VARIANT[status as keyof typeof STATUS_VARIANT] ??
                  'secondary'

                return (
                  <tr
                    key={String(client.id)}
                    className="transition-colors hover:bg-muted/20"
                  >
                    <td className="px-4 py-3.5 font-medium sm:px-5">
                      {client.companyName || '—'}
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {client.contactName || '—'}
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {client.email || '—'}
                    </td>
                    <td className="px-4 py-3.5">
                      {formatPlanLabel(client.plan)}
                    </td>
                    <td className="px-4 py-3.5 sm:px-5">
                      <Badge variant={variant} className="capitalize">
                        {status}
                      </Badge>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
