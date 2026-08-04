import type { Metadata } from 'next'
import Link from 'next/link'
import { Download, FolderOpen } from 'lucide-react'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import { getDbUserWithMemberships, requireAuth } from '@/lib/auth'
import {
  formatBytes,
  formatPortalDate,
  getMediaByOrgId,
} from '@/lib/portal'

export const metadata: Metadata = { title: 'Your Files' }

export default async function DashboardFilesPage() {
  await requireAuth()
  const dbUser = await getDbUserWithMemberships()
  const org = dbUser?.memberships[0]?.organization
  const files = org ? await getMediaByOrgId(org.id) : []

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Your Files"
        description={
          org
            ? `Deliverables and assets shared with ${org.name}.`
            : 'Create an organization to access shared files.'
        }
      />

      {!org ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              You need an organization before files can be shared with you.
            </p>
            <Button asChild>
              <Link href="/dashboard/settings">Go to settings</Link>
            </Button>
          </CardContent>
        </Card>
      ) : files.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center py-14 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <FolderOpen className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="mb-2">No files yet</CardTitle>
            <CardDescription className="max-w-md">
              When deliverables are uploaded for your project, they&apos;ll
              appear here for download.
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {files.map((file) => (
            <Card
              key={String(file.id)}
              className="transition-all hover:border-primary/20 hover:shadow-md"
            >
              <CardContent className="flex flex-col gap-4 p-5">
                <div>
                  <p className="truncate font-medium">
                    {file.filename || `File ${file.id}`}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatBytes(file.filesize)} ·{' '}
                    {formatPortalDate(file.createdAt)}
                  </p>
                </div>
                {file.url ? (
                  <Button variant="outline" size="sm" className="w-fit" asChild>
                    <a href={file.url} download target="_blank" rel="noreferrer">
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  </Button>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Download unavailable
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
