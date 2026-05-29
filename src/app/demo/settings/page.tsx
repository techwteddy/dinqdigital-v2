import Link from 'next/link'
import { Bell, Shield, User, Users } from 'lucide-react'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { NotificationSettings } from '@/components/dashboard/notification-settings'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DEMO_ORGANIZATIONS, DEMO_USER } from '@/lib/demo-data'

export default function DemoSettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        isDemo
        title="Settings"
        description="Profile, workspaces, notifications, and security — interactive demo toggles."
        action={{ label: 'Start free trial', href: '/auth/register' }}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile
          </CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="demo-name">
              Full name
            </label>
            <Input id="demo-name" defaultValue={DEMO_USER.name} readOnly />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="demo-email">
              Email
            </label>
            <Input id="demo-email" defaultValue={DEMO_USER.email} readOnly />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Workspaces
          </CardTitle>
          <CardDescription>Organizations you belong to</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border rounded-xl border border-border">
            {DEMO_ORGANIZATIONS.map((org) => (
              <li
                key={org.id}
                className="flex items-center justify-between gap-4 px-4 py-3.5 text-sm"
              >
                <div>
                  <p className="font-medium">{org.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {org.members} members · {org.plan} plan
                  </p>
                </div>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs capitalize">
                  {org.role}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <NotificationSettings />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="flex items-start gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Push notifications</p>
              <p className="text-xs text-muted-foreground">
                Browser and mobile alerts
              </p>
              <p className="mt-2 text-xs text-primary">Coming soon</p>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="flex items-start gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Security</p>
              <p className="text-xs text-muted-foreground">
                2FA, sessions, and API keys
              </p>
              <p className="mt-2 text-xs text-primary">
                Configure after signup
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button asChild size="lg" className="w-full sm:w-auto">
        <Link href="/auth/register">Create a real account</Link>
      </Button>
    </div>
  )
}
