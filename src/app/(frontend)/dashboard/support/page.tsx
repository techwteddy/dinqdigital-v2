import type { Metadata } from 'next'
import Link from 'next/link'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { ClientSupportPanel } from '@/components/support/client-support-panel'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getDbUserWithMemberships, requireAuth } from '@/lib/auth'

export const metadata: Metadata = { title: 'Support' }

export default async function DashboardSupportPage() {
  await requireAuth()
  const dbUser = await getDbUserWithMemberships()
  const org = dbUser?.memberships[0]?.organization

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Support"
        description="Get help with your project"
      />

      {!org ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Create an organization before opening a support ticket.
            </p>
            <Button asChild>
              <Link href="/dashboard/settings">Go to settings</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ClientSupportPanel orgId={org.id} />
      )}
    </div>
  )
}
