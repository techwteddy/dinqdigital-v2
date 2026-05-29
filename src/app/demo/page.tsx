import Link from 'next/link'
import { ArrowRight, CreditCard, Users } from 'lucide-react'
import { DemoActivityChart } from '@/components/demo/demo-activity-chart'
import { DemoActivityFeed } from '@/components/demo/demo-activity-feed'
import { DemoMetricsGrid } from '@/components/demo/demo-metrics-grid'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DEMO_ORGANIZATIONS, DEMO_USER } from '@/lib/demo-data'

export default function DemoDashboardPage() {
  const firstName = DEMO_USER.name.split(' ')[0]

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge variant="secondary" className="mb-3">
            Demo mode
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight">
            Good morning, {firstName}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here&apos;s what&apos;s happening across your workspaces today.
          </p>
        </div>
        <Button asChild>
          <Link href="/auth/register">
            Start free trial
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <DemoMetricsGrid />

      <div className="grid gap-6 lg:grid-cols-3">
        <DemoActivityChart />
        <DemoActivityFeed />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Your workspaces</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {DEMO_ORGANIZATIONS.map((org) => (
            <Card key={org.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
                    {org.name[0]}
                  </div>
                  <Badge variant={org.active ? 'success' : 'secondary'}>
                    {org.plan}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{org.name}</CardTitle>
                <CardDescription className="capitalize">
                  Role: {org.role}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {org.members} members
                  </span>
                  <span className="flex items-center gap-1">
                    <CreditCard className="h-3.5 w-3.5" />
                    Renews in {org.renewsIn}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link href="/demo/billing" className="group">
          <Card className="transition-colors hover:border-primary/30">
            <CardContent className="flex items-center gap-4 p-5">
              <CreditCard className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium">Billing</p>
                <p className="text-xs text-muted-foreground">Plans & invoices</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/demo/settings" className="group">
          <Card className="transition-colors hover:border-primary/30">
            <CardContent className="flex items-center gap-4 p-5">
              <Users className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium">Settings</p>
                <p className="text-xs text-muted-foreground">Profile & team</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
