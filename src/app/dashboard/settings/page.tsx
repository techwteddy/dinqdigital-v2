import type { Metadata } from 'next'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Settings, Users } from 'lucide-react'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const user = await requireAuth()

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      memberships: {
        include: { organization: { include: { members: true } } },
      },
    },
  })

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your profile and organization preferences.
        </p>
      </div>

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
            <Input id="name" defaultValue={dbUser?.name ?? ''} disabled />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input id="email" type="email" defaultValue={user.email ?? ''} disabled />
          </div>
          <p className="text-xs text-muted-foreground">
            Profile editing will be available in a future release. Data is synced from Supabase Auth.
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
          {!dbUser?.memberships.length ? (
            <p className="text-sm text-muted-foreground">
              You are not part of any organization yet.
            </p>
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {dbUser.memberships.map(({ organization: org, role }) => (
                <li
                  key={org.id}
                  className="flex items-center justify-between px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{org.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {org.members.length} member{org.members.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium capitalize">
                    {role.toLowerCase()}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Button className="mt-4" disabled>
            Create organization (coming soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
