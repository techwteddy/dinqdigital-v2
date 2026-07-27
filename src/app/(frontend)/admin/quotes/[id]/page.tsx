import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
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
import {
  formatAdminDate,
  getFormSubmissionById,
  getSubmissionField,
} from '@/lib/admin'

export const metadata: Metadata = { title: 'Quote Details' }

interface QuoteDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminQuoteDetailPage({
  params,
}: QuoteDetailPageProps) {
  const { id } = await params
  const submission = await getFormSubmissionById(id)

  if (!submission) notFound()

  const name = getSubmissionField(submission, 'full-name')
  const email = getSubmissionField(submission, 'email')
  const company = getSubmissionField(submission, 'company-name')
  const budget = getSubmissionField(submission, 'budget-tier')
  const description = getSubmissionField(submission, 'project-description')

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" className="w-fit px-0" asChild>
          <Link href="/admin/quotes">
            <ArrowLeft className="h-4 w-4" />
            Back to quotes
          </Link>
        </Button>
        <DashboardPageHeader
          title={name}
          description="Full quote submission details"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
          <div>
            <CardTitle>{name}</CardTitle>
            <CardDescription>{email}</CardDescription>
          </div>
          <Badge variant="secondary">New</Badge>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card/80 p-4">
            <p className="text-xs font-medium text-muted-foreground">Company</p>
            <p className="mt-1 text-sm font-semibold">{company}</p>
          </div>
          <div className="rounded-lg border border-border bg-card/80 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Budget Tier
            </p>
            <p className="mt-1 text-sm font-semibold">{budget}</p>
          </div>
          <div className="rounded-lg border border-border bg-card/80 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Submitted
            </p>
            <p className="mt-1 text-sm font-semibold">
              {formatAdminDate(submission.createdAt)}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card/80 p-4 sm:col-span-2">
            <p className="text-xs font-medium text-muted-foreground">
              Project Description
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
