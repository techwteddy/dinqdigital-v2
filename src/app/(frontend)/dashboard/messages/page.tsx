import type { Metadata } from 'next'
import Link from 'next/link'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { ClientMessagesPanel } from '@/components/messaging/client-messages-panel'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getDbUserWithMemberships, requireAuth } from '@/lib/auth'

export const metadata: Metadata = { title: 'Messages' }

export default async function DashboardMessagesPage() {
  const user = await requireAuth()
  const dbUser = await getDbUserWithMemberships()
  const org = dbUser?.memberships[0]?.organization
  const userName =
    (typeof user.user_metadata?.full_name === 'string'
      ? user.user_metadata.full_name
      : null) ??
    dbUser?.name ??
    user.email?.split('@')[0] ??
    'You'

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Messages"
        description="Chat with Ted about your project."
      />

      {!org ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Create an organization before messaging Ted.
            </p>
            <Button asChild>
              <Link href="/dashboard/settings">Go to settings</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ClientMessagesPanel
          orgId={org.id}
          userEmail={user.email ?? ''}
          userName={userName}
        />
      )}
    </div>
  )
}
