interface BillingAlertsProps {
  success?: string
  canceled?: string
}

export function BillingAlerts({ success, canceled }: BillingAlertsProps) {
  if (success === 'true') {
    return (
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-300">
        Payment successful. Your subscription will update shortly.
      </div>
    )
  }

  if (canceled === 'true') {
    return (
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
        Checkout was canceled. You can try again when you are ready.
      </div>
    )
  }

  return null
}
