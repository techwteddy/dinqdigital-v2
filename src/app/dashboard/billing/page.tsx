import type { Metadata } from 'next'
import Link from 'next/link'
import { CreditCard, ExternalLink } from 'lucide-react'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { isSubscriptionActive } from '@/lib/utils'

export const metadata: Metadata = { title: 'Billing' }

export default async function BillingPage() {
  const user = await requireAuth()

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      memberships: {
        include: {
          organization: {
            include: { subscription: { include: { plan: true } } },
          },
        },
        take: 1,
      },
    },
  })

  const org = dbUser?.memberships[0]?.organization
  const sub = org?.subscription
  const active = sub ? isSubscriptionActive(sub.status) : false

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your subscription and payment methods.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Current plan
              </CardTitle>
              <CardDescription className="mt-1">
                {org ? `Organization: ${org.name}` : 'No organization selected'}
              </CardDescription>
            </div>
            <Badge variant={active ? 'success' : 'secondary'}>
              {active ? (sub?.plan?.name ?? 'Active') : 'Free'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {sub ? (
            <p className="text-sm text-muted-foreground">
              Status:{' '}
              <span className="capitalize text-foreground">
                {sub.status.toLowerCase()}
              </span>
              {sub.cancelAtPeriodEnd && ' · Cancels at period end'}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Upgrade to unlock more organizations, members, and priority
              support.
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/auth/register">Upgrade plan</Link>
            </Button>
            <Button variant="outline" asChild>
              <a
                href="https://dashboard.stripe.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Stripe dashboard
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
