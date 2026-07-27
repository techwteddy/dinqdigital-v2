import type { Metadata } from 'next'
import { Download } from 'lucide-react'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { Button } from '@/components/ui/button'
import {
  formatBytes,
  formatPortalDate,
  getAllMedia,
} from '@/lib/portal'

export const metadata: Metadata = { title: 'Client Deliverables' }

export default async function AdminFilesPage() {
  const files = await getAllMedia(100)

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Client Deliverables"
        description="All media uploaded in Payload — use alt text with the org ID to tag clients."
        action={{
          label: 'Upload',
          href: '/cms/collections/media',
        }}
      />

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 sm:px-5">Filename</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Upload Date</th>
              <th className="px-4 py-3 text-right sm:px-5"> </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {files.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-muted-foreground sm:px-5"
                >
                  No media files yet. Upload deliverables in Payload CMS.
                </td>
              </tr>
            ) : (
              files.map((file) => (
                <tr
                  key={String(file.id)}
                  className="transition-colors hover:bg-muted/20"
                >
                  <td className="px-4 py-3.5 font-medium sm:px-5">
                    {file.filename || `File ${file.id}`}
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">
                    {file.alt?.trim() || '—'}
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">
                    {formatBytes(file.filesize)}
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">
                    {formatPortalDate(file.createdAt)}
                  </td>
                  <td className="px-4 py-3.5 text-right sm:px-5">
                    {file.url ? (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={file.url}
                          download
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
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
