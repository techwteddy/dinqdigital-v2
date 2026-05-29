import Link from 'next/link'
import { Check, CreditCard } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DEMO_BILLING } from '@/lib/demo-data'
import { PLANS } from '@/lib/marketing'

export default function DemoBillingPage() {
  const proPlan = PLANS.find((p) => p.highlighted)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Badge variant="secondary" className="mb-3">
          Demo mode
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="mt-1 text-muted-foreground">
          Sample billing view — connect Stripe in your real deployment.
        </p>
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Current plan
              </CardTitle>
              <CardDescription className="mt-1">
                {DEMO_BILLING.plan} · {DEMO_BILLING.price}/{DEMO_BILLING.period}
              </CardDescription>
            </div>
            <Badge variant="success">{DEMO_BILLING.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card/50 p-4">
            <p className="text-xs text-muted-foreground">Next billing date</p>
            <p className="mt-1 font-medium">{DEMO_BILLING.nextBilling}</p>
          </div>
          <div className="rounded-lg border border-border bg-card/50 p-4">
            <p className="text-xs text-muted-foreground">Payment method</p>
            <p className="mt-1 font-medium">{DEMO_BILLING.paymentMethod}</p>
          </div>
        </CardContent>
      </Card>

      {proPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Plan features</CardTitle>
            <CardDescription>Everything included in your Pro subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 sm:grid-cols-2">
              {proPlan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Ready to use real billing? Sign up and connect your Stripe account.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/auth/register">Create your account</Link>
        </Button>
      </div>
    </div>
  )
}
