import type { Metadata } from 'next'
import Link from 'next/link'
import { Briefcase, Check } from 'lucide-react'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getDbUserWithMemberships, requireAuth } from '@/lib/auth'
import {
  formatPortalDate,
  getMilestonesForOrg,
  getProjectByOrgId,
  getStageIndex,
  PROJECT_STAGES,
} from '@/lib/portal'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Your Project' }

const MILESTONE_VARIANT = {
  pending: 'secondary',
  'in-progress': 'default',
  complete: 'success',
} as const

export default async function DashboardProjectsPage() {
  await requireAuth()
  const dbUser = await getDbUserWithMemberships()
  const org = dbUser?.memberships[0]?.organization

  const project = org ? await getProjectByOrgId(org.id) : null
  const milestones = org ? await getMilestonesForOrg(org.id) : []
  const currentIndex = getStageIndex(project?.status)

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Your Project"
        description={
          org
            ? `Project timeline and milestones for ${org.name}.`
            : 'Create an organization to view your project.'
        }
      />

      {!org ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              You need an organization before we can assign a project.
            </p>
            <Button asChild>
              <Link href="/dashboard/settings">Go to settings</Link>
            </Button>
          </CardContent>
        </Card>
      ) : !project ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center py-14 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Briefcase className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="mb-2">No project assigned yet</CardTitle>
            <CardDescription className="max-w-md">
              Once Ted kicks off your build, your timeline and milestones will
              show up here.
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>{project.clientName || 'Your project'}</CardTitle>
                  <CardDescription className="mt-1 capitalize">
                    Status: {project.status || 'discovery'}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {project.status || 'discovery'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ol className="grid gap-3 sm:grid-cols-5">
                {PROJECT_STAGES.map((stage, index) => {
                  const complete =
                    project.status === 'complete' || index < currentIndex
                  const current =
                    project.status !== 'complete' && index === currentIndex

                  return (
                    <li
                      key={stage.key}
                      className={cn(
                        'rounded-xl border px-3 py-4 text-center transition-colors',
                        complete &&
                          'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
                        current &&
                          'border-primary bg-primary/10 text-primary shadow-sm',
                        !complete &&
                          !current &&
                          'border-border bg-muted/20 text-muted-foreground'
                      )}
                    >
                      <div className="mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full border border-current/20 text-xs font-semibold">
                        {complete ? <Check className="h-3.5 w-3.5" /> : index + 1}
                      </div>
                      <p className="text-sm font-semibold">{stage.label}</p>
                    </li>
                  )
                })}
              </ol>
            </CardContent>
          </Card>

          <div>
            <h2 className="mb-4 text-lg font-semibold">Milestones</h2>
            {milestones.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                  No milestones yet for this project.
                </CardContent>
              </Card>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[480px] text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-3 sm:px-5">Title</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 sm:px-5">Due date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {milestones.map((milestone) => {
                      const status = milestone.status || 'pending'
                      const variant =
                        MILESTONE_VARIANT[
                          status as keyof typeof MILESTONE_VARIANT
                        ] ?? 'secondary'

                      return (
                        <tr
                          key={String(milestone.id)}
                          className="transition-colors hover:bg-muted/20"
                        >
                          <td className="px-4 py-3.5 font-medium sm:px-5">
                            {milestone.title || 'Untitled milestone'}
                          </td>
                          <td className="px-4 py-3.5">
                            <Badge variant={variant} className="capitalize">
                              {status.replace('-', ' ')}
                            </Badge>
                          </td>
                          <td className="px-4 py-3.5 text-muted-foreground sm:px-5">
                            {formatPortalDate(milestone.dueDate)}
                          </td>
                        </tr>
                      )
                    })}
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
