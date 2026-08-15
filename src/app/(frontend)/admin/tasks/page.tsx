import type { Metadata } from 'next'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { AdminTasksPanel } from '@/components/tasks/admin-tasks-panel'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = { title: 'Tasks' }

export default async function AdminTasksPage() {
  const organizations = await prisma.organization.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Tasks"
        description="Assign and track work across all client organizations."
      />
      <AdminTasksPanel organizations={organizations} />
    </div>
  )
}
