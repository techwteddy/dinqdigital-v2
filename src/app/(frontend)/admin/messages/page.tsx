import type { Metadata } from 'next'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { AdminMessagesPanel } from '@/components/messaging/admin-messages-panel'

export const metadata: Metadata = { title: 'Messages' }

export default function AdminMessagesPage() {
  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Messages"
        description="Client conversations across all organizations."
      />
      <AdminMessagesPanel />
    </div>
  )
}
