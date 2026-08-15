import type { Metadata } from 'next'
import Link from 'next/link'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { ServiceRequestForm } from '@/components/dashboard/service-request-form'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { getDbUserWithMemberships, requireAuth } from '@/lib/auth'
import {
  ensureServiceRequestFormId,
  formatPortalDate,
  getServiceRequestsForOrg,
  getSubmissionField,
} from '@/lib/portal'

export const metadata: Metadata = { title: 'Service Requests' }

export default async function DashboardRequestsPage() {
  const user = await requireAuth()
  const dbUser = await getDbUserWithMemberships()
  const org = dbUser?.memberships[0]?.organization
  const formId = await ensureServiceRequestFormId()
  const requests = org ? await getServiceRequestsForOrg(org.id) : []

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Service Requests"
        description="Submit feature, content, design, page, and integration requests."
      />

      {!org ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Create an organization before submitting service requests.
            </p>
            <Button asChild>
              <Link href="/dashboard/settings">Go to settings</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <ServiceRequestForm
            formId={formId}
            orgId={org.id}
            email={user.email ?? dbUser?.email ?? ''}
          />

          <div>
            <h2 className="mb-4 text-lg font-semibold">Past requests</h2>
            {requests.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                  No requests yet.
                </CardContent>
              </Card>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-3 sm:px-5">Type</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3 sm:px-5">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {requests.map((request) => (
                      <tr
                        key={String(request.id)}
                        className="transition-colors hover:bg-muted/20"
                      >
                        <td className="px-4 py-3.5 sm:px-5">
                          <Badge variant="secondary">
                            {getSubmissionField(request, 'request-type')}
                          </Badge>
                        </td>
                        <td className="max-w-md px-4 py-3.5 text-muted-foreground">
                          <p className="line-clamp-2">
                            {getSubmissionField(request, 'description')}
                          </p>
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground sm:px-5">
                          {formatPortalDate(request.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
