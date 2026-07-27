import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/admin'
import { formatRelativeDate, isSubscriptionActive } from '@/lib/utils'

export type BillingRow = {
  id: string
  client: string
  plan: string
  status: string
  amount: string
  nextBillingDate: string
  active: boolean
  pending: boolean
  monthlyAmount: number
}

export async function getAdminBillingSummary() {
  const subscriptions = await prisma.subscription.findMany({
    include: {
      organization: true,
      plan: true,
    },
    orderBy: { updatedAt: 'desc' },
  })

  const rows: BillingRow[] = subscriptions.map((sub) => {
    const active = isSubscriptionActive(sub.status)
    const pending =
      sub.status === 'PAST_DUE' ||
      sub.status === 'INCOMPLETE' ||
      sub.status === 'UNPAID'
    const monthlyAmount =
      sub.plan.interval === 'YEAR'
        ? Math.round(sub.plan.amount / 12)
        : sub.plan.amount

    return {
      id: sub.id,
      client: sub.organization.name,
      plan: sub.plan.name,
      status: sub.status.toLowerCase().replaceAll('_', ' '),
      amount: formatCurrency(sub.plan.amount / 100),
      nextBillingDate: formatRelativeDate(sub.currentPeriodEnd),
      active,
      pending,
      monthlyAmount,
    }
  })

  const totalMrrCents = rows
    .filter((row) => row.active)
    .reduce((sum, row) => sum + row.monthlyAmount, 0)

  return {
    rows,
    totalMrr: formatCurrency(totalMrrCents / 100),
    activeSubscriptions: rows.filter((row) => row.active).length,
    pendingPayments: rows.filter((row) => row.pending).length,
  }
}
