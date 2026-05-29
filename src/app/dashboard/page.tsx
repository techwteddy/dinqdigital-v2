import type { Metadata } from 'next'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatRelativeDate, isSubscriptionActive } from '@/lib/utils'
import Link from 'next/link'
import { ArrowRight, CreditCard, Users, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const user = await requireAuth()

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      memberships: {
        include: {
          organization: {
            include: {
              subscription: { include: { plan: true } },
              members: true,
            },
          },
        },
      },
    },
  })

  const memberships = dbUser?.memberships ?? []
  const firstName = dbUser?.name?.split(' ')[0] ?? 'there'

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s an overview of your organizations and quick actions.
        </p>
      </div>

      {memberships.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Zap className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="mb-2">No organizations yet</CardTitle>
            <CardDescription className="mb-6 max-w-sm">
              Create your first organization to unlock team features, billing,
              and settings.
            </CardDescription>
            <Button asChild>
              <Link href="/dashboard/settings">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {memberships.map(({ organization: org, role }) => {
            const sub = org.subscription
            const active = sub ? isSubscriptionActive(sub.status) : false

            return (
              <Card key={org.id} className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
                      {org.name[0].toUpperCase()}
                    </div>
                    <Badge variant={active ? 'success' : 'secondary'}>
                      {active ? (sub?.plan?.name ?? 'Active') : 'Free'}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{org.name}</CardTitle>
                  <CardDescription className="capitalize">
                    Role: {role.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {org.members.length} member
                      {org.members.length !== 1 ? 's' : ''}
                    </span>
                    {sub && (
                      <span className="flex items-center gap-1">
                        <CreditCard className="h-3.5 w-3.5" />
                        Renews {formatRelativeDate(sub.currentPeriodEnd)}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <div>
        <h2 className="mb-4 text-lg font-semibold">Quick actions</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/dashboard/billing" className="group">
            <Card className="transition-colors hover:border-primary/30 hover:bg-accent/30">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Manage billing</p>
                  <p className="text-xs text-muted-foreground">
                    Upgrade or manage your subscription
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/settings" className="group">
            <Card className="transition-colors hover:border-primary/30 hover:bg-accent/30">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Team & settings</p>
                  <p className="text-xs text-muted-foreground">
                    Profile and organization preferences
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
