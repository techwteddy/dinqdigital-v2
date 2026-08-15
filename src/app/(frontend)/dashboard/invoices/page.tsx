import type { Metadata } from 'next'
import Link from 'next/link'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { ClientInvoicesPanel } from '@/components/invoices/client-invoices-panel'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getDbUserWithMemberships, requireAuth } from '@/lib/auth'

export const metadata: Metadata = { title: 'Invoices' }

export default async function DashboardInvoicesPage() {
  await requireAuth()
  const dbUser = await getDbUserWithMemberships()
  const org = dbUser?.memberships[0]?.organization

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Invoices"
        description="Your billing history and outstanding payments."
      />

      {!org ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Create an organization before viewing invoices.
            </p>
            <Button asChild>
              <Link href="/dashboard/settings">Go to settings</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ClientInvoicesPanel orgId={org.id} />
      )}
    </div>
  )
}
