import type { Metadata } from 'next'
import { Mail, MessageSquare } from 'lucide-react'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import { requireAuth } from '@/lib/auth'

export const metadata: Metadata = { title: 'Messages' }

export default async function DashboardMessagesPage() {
  await requireAuth()

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Messages"
        description="Chat with your Dinq Digital project lead."
      />

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center py-14 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <MessageSquare className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="mb-2">Messages coming soon</CardTitle>
          <CardDescription className="mb-6 max-w-md">
            Coming soon — message Ted directly at techwithteddy@gmail.com
          </CardDescription>
          <Button asChild>
            <a href="mailto:techwithteddy@gmail.com">
              <Mail className="h-4 w-4" />
              Email Ted
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
