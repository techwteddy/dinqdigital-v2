import type { Metadata } from 'next'
import { AdminClientsTabs } from '@/components/admin/admin-clients-tabs'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { getClients } from '@/lib/admin'

export const metadata: Metadata = { title: 'Clients' }

export default async function AdminClientsPage() {
  const { docs } = await getClients(100)

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Clients"
        description="Agency clients managed in Payload."
        action={{ label: 'Add Client', href: '/cms/collections/clients/create' }}
      />

      <AdminClientsTabs clients={docs} />
    </div>
  )
}
