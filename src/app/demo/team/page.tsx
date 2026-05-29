'use client'

import Link from 'next/link'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { TeamMemberList } from '@/components/dashboard/team-member-list'
import { DEMO_ORG, DEMO_TEAM } from '@/lib/demo-data'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export default function DemoTeamPage() {
  const { toast } = useToast()

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        isDemo
        title="Team"
        description={`Manage members in ${DEMO_ORG.name} — roles, status, and invitations.`}
        action={{ label: 'Start free trial', href: '/auth/register' }}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{DEMO_ORG.name}</CardTitle>
          <CardDescription>
            {DEMO_TEAM.length} people · {DEMO_ORG.members} seats used on Pro
            plan
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-0">
          <TeamMemberList
            members={DEMO_TEAM}
            showInvite
            onInviteClick={() =>
              toast({
                title: 'Demo only',
                description: 'Sign up to send real team invitations.',
              })
            }
          />
        </CardContent>
      </Card>

      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Role-based access, SSO, and audit logs ship in your own deployment.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/auth/register">Create your workspace</Link>
        </Button>
      </div>
    </div>
  )
}
