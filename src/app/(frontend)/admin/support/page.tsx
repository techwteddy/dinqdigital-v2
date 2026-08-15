import type { Metadata } from 'next'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { AdminSupportPanel } from '@/components/support/admin-support-panel'

export const metadata: Metadata = { title: 'Support Tickets' }

export default function AdminSupportPage() {
  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Support Tickets"
        description="Triage and resolve client support requests."
      />
      <AdminSupportPanel />
    </div>
  )
}
