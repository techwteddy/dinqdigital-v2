import type { Metadata } from 'next'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { AdminInvoicesPanel } from '@/components/invoices/admin-invoices-panel'

export const metadata: Metadata = { title: 'Invoices' }

export default function AdminInvoicesPage() {
  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Invoices"
        description="Create and track client invoices."
      />
      <AdminInvoicesPanel />
    </div>
  )
}
