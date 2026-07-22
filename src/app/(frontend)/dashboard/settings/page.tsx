import type { Metadata } from 'next'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { NotificationSettings } from '@/components/dashboard/notification-settings'
import { getDbUserWithMemberships, requireAuth } from '@/lib/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Settings, Users } from 'lucide-react'
import { CreateOrganizationForm } from '@/components/settings/create-organization-form'
import { InviteMemberForm } from '@/components/settings/invite-member-form'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const user = await requireAuth()
  const dbUser = await getDbUserWithMemberships()

  const primaryMembership = dbUser?.memberships[0]
  const org = primaryMembership?.organization
  const isAdmin =
    primaryMembership?.role === 'ADMIN' ||
    primaryMembership?.role === 'SUPER_ADMIN'

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Settings"
        description="Manage your profile, organizations, notifications, and team invitations."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Profile
          </CardTitle>
          <CardDescription>Your personal account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Full name
            </label>
            <Input id="name" defaultValue={dbUser?.name ?? ''} readOnly />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              defaultValue={user.email ?? ''}
              readOnly
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Profile is synced from Supabase Auth.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Organizations
          </CardTitle>
          <CardDescription>Teams you belong to.</CardDescription>
        </CardHeader>
        <CardContent>
          {dbUser?.memberships.length ? (
            <ul className="mb-6 divide-y divide-border rounded-xl border border-border">
              {dbUser.memberships.map(({ organization: o, role }) => (
                <li
                  key={o.id}
                  className="flex items-center justify-between gap-4 px-4 py-3.5 text-sm"
                >
                  <div>
                    <p className="font-medium">{o.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {o.members.length} member
                      {o.members.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium capitalize">
                    {role.toLowerCase()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mb-6 text-sm text-muted-foreground">
              You are not part of any organization yet.
            </p>
          )}
          <CreateOrganizationForm />
        </CardContent>
      </Card>

      <NotificationSettings readOnly />

      {org && isAdmin && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Invite team members</CardTitle>
            <CardDescription>
              Send an email invitation to join {org.name}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InviteMemberForm organizationId={org.id} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
