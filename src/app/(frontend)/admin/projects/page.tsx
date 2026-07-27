import type { Metadata } from 'next'
import { Briefcase } from 'lucide-react'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { OrgWorkspaceGrid } from '@/components/dashboard/org-workspace-grid'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import {
  formatAdminDate,
  formatPlanLabel,
  getClients,
} from '@/lib/admin'

export const metadata: Metadata = { title: 'Projects' }

export default async function AdminProjectsPage() {
  const { docs } = await getClients(100)

  const projects = docs.map((client) => ({
    id: String(client.id),
    name: client.companyName || 'Untitled client',
    role: client.status || 'active',
    members: 1,
    planLabel: formatPlanLabel(client.plan),
    active: client.status === 'active',
    renewsLabel: client.createdAt
      ? `Started ${formatAdminDate(client.createdAt)}`
      : undefined,
  }))

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Projects"
        description="Client projects tracked from your agency roster."
      />

      {projects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center py-14 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Briefcase className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="mb-2">No projects yet</CardTitle>
            <CardDescription className="max-w-md">
              Add clients in Payload to see project cards here with status,
              start date, and plan value.
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <OrgWorkspaceGrid workspaces={projects} title="Active projects" />
      )}
    </div>
  )
}
