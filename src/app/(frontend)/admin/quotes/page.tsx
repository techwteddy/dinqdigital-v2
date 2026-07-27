import type { Metadata } from 'next'
import Link from 'next/link'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  formatAdminDate,
  getFormSubmissions,
  getSubmissionField,
} from '@/lib/admin'

export const metadata: Metadata = { title: 'Quote Submissions' }

export default async function AdminQuotesPage() {
  const { docs } = await getFormSubmissions(100)

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Quote Submissions"
        description="All Start a Project form submissions from the landing page."
      />

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 sm:px-5">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Budget Tier</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right sm:px-5"> </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {docs.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-muted-foreground sm:px-5"
                >
                  No quote submissions yet.
                </td>
              </tr>
            ) : (
              docs.map((submission) => (
                <tr
                  key={String(submission.id)}
                  className="transition-colors hover:bg-muted/20"
                >
                  <td className="px-4 py-3.5 font-medium sm:px-5">
                    {getSubmissionField(submission, 'full-name')}
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">
                    {getSubmissionField(submission, 'email')}
                  </td>
                  <td className="px-4 py-3.5">
                    {getSubmissionField(submission, 'budget-tier')}
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">
                    {formatAdminDate(submission.createdAt)}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant="secondary">New</Badge>
                  </td>
                  <td className="px-4 py-3.5 text-right sm:px-5">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/quotes/${submission.id}`}>View</Link>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
