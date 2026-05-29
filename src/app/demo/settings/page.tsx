import Link from 'next/link'
import { Bell, Shield, User, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
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
      <div>
        <Badge variant="secondary" className="mb-3">
          Demo mode
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Profile and team preferences — sample data for preview.
        </p>
      </div>

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
            <label className="text-sm font-medium">Full name</label>
            <Input defaultValue={DEMO_USER.name} readOnly />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input defaultValue={DEMO_USER.email} readOnly />
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
          <ul className="divide-y divide-border rounded-lg border border-border">
            {DEMO_ORGANIZATIONS.map((org) => (
              <li
                key={org.id}
                className="flex items-center justify-between px-4 py-3 text-sm"
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

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-start gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Notifications</p>
              <p className="text-xs text-muted-foreground">
                Email digests, alerts, and mentions
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-start gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Security</p>
              <p className="text-xs text-muted-foreground">
                2FA, sessions, and API keys
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button asChild>
        <Link href="/auth/register">Create a real account</Link>
      </Button>
    </div>
  )
}
