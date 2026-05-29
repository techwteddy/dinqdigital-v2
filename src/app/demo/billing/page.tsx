import Link from 'next/link'
import { Check, CreditCard } from 'lucide-react'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { InvoiceTable } from '@/components/dashboard/invoice-table'
import { UsageMeter } from '@/components/dashboard/usage-meter'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { DEMO_BILLING, DEMO_INVOICES } from '@/lib/demo-data'
import { PLANS } from '@/lib/marketing'

export default function DemoBillingPage() {
  const proPlan = PLANS.find((p) => p.highlighted)

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        isDemo
        title="Billing"
        description="Plans, usage, invoices, and payment methods — sample Stripe-style UI."
        action={{ label: 'Start free trial', href: '/auth/register' }}
      />

      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-violet-500/5">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
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
          <div className="rounded-lg border border-border bg-card/80 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Next billing date
            </p>
            <p className="mt-1 text-lg font-semibold">
              {DEMO_BILLING.nextBilling}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card/80 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Payment method
            </p>
            <p className="mt-1 text-lg font-semibold">
              {DEMO_BILLING.paymentMethod}
            </p>
          </div>
        </CardContent>
      </Card>

      <UsageMeter
        label={DEMO_BILLING.usageLabel}
        used={DEMO_BILLING.usageUsed}
        limit={DEMO_BILLING.usageLimit}
        percent={DEMO_BILLING.usagePercent}
      />

      {proPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Plan features</CardTitle>
            <CardDescription>
              Everything included in your Pro subscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 sm:grid-cols-2">
              {proPlan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="mb-4 text-lg font-semibold">Invoice history</h2>
        <InvoiceTable invoices={DEMO_INVOICES} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={
              plan.highlighted
                ? 'border-primary shadow-md ring-1 ring-primary/20'
                : undefined
            }
          >
            <CardHeader>
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-2xl font-bold text-foreground">
                  {plan.price}
                </span>
                {plan.period}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {plan.features.slice(0, 3).map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Ready for real billing? Sign up and connect your Stripe account.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/auth/register">Create your account</Link>
        </Button>
      </div>
    </div>
  )
}
