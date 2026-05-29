'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PlanOption {
  id: string
  name: string
  stripePriceIdMonth: string | null
  amount: number
  isPopular: boolean
}

interface BillingActionsProps {
  organizationId: string
  hasSubscription: boolean
  hasStripeCustomer: boolean
  plans: PlanOption[]
}

export function BillingActions({
  organizationId,
  hasSubscription,
  hasStripeCustomer,
  plans,
}: BillingActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function startCheckout(priceId: string) {
    setLoading(`checkout-${priceId}`)
    setError(null)

    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId, organizationId }),
    })

    const data = await response.json()

    if (!response.ok) {
      setError(data.error ?? 'Checkout failed')
      setLoading(null)
      return
    }

    if (data.url) {
      window.location.href = data.url
    }
  }

  async function openPortal() {
    setLoading('portal')
    setError(null)

    const response = await fetch('/api/stripe/portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organizationId }),
    })

    const data = await response.json()

    if (!response.ok) {
      setError(
        typeof data.error === 'string'
          ? data.error
          : 'Could not open billing portal'
      )
      setLoading(null)
      return
    }

    if (data.url) {
      window.location.href = data.url
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {!hasSubscription && (
        <div className="grid gap-3 sm:grid-cols-2">
          {plans
            .filter((p) => p.stripePriceIdMonth)
            .map((plan) => (
              <div
                key={plan.id}
                className="rounded-lg border border-border p-4"
              >
                <p className="font-semibold">{plan.name}</p>
                <p className="text-sm text-muted-foreground">
                  ${(plan.amount / 100).toFixed(0)}/month
                </p>
                <Button
                  className="mt-3 w-full"
                  variant={plan.isPopular ? 'default' : 'outline'}
                  disabled={!!loading}
                  onClick={() => startCheckout(plan.stripePriceIdMonth!)}
                >
                  {loading === `checkout-${plan.stripePriceIdMonth}` && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Start trial
                </Button>
              </div>
            ))}
        </div>
      )}

      {hasStripeCustomer && (
        <Button variant="outline" disabled={!!loading} onClick={openPortal}>
          {loading === 'portal' && <Loader2 className="h-4 w-4 animate-spin" />}
          Manage subscription
        </Button>
      )}

      {hasSubscription && (
        <Button variant="ghost" size="sm" onClick={() => router.refresh()}>
          Refresh status
        </Button>
      )}
    </div>
  )
}
