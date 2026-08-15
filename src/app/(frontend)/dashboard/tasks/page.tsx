import type { Metadata } from 'next'
import Link from 'next/link'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { ClientTasksPanel } from '@/components/tasks/client-tasks-panel'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getDbUserWithMemberships, requireAuth } from '@/lib/auth'

export const metadata: Metadata = { title: 'Tasks' }

export default async function DashboardTasksPage() {
  await requireAuth()
  const dbUser = await getDbUserWithMemberships()
  const org = dbUser?.memberships[0]?.organization

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Tasks"
        description={
          org
            ? `Action items for ${org.name}.`
            : 'Create an organization to view your tasks.'
        }
      />

      {!org ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              You need an organization before tasks can be assigned.
            </p>
            <Button asChild>
              <Link href="/dashboard/settings">Go to settings</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ClientTasksPanel orgId={org.id} />
      )}
    </div>
  )
}
