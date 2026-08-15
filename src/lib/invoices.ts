export type InvoiceStatus = 'pending' | 'paid' | 'overdue'
export type InvoiceType = 'stripe' | 'custom'

export type InvoiceItem = {
  id: string
  orgId: string
  clientEmail: string
  title: string
  amount: number
  status: InvoiceStatus | string
  type: InvoiceType | string
  stripeId?: string | null
  notes?: string | null
  dueDate?: string | null
  paidAt?: string | null
  createdAt: string
  updatedAt: string
}

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  overdue: 'Overdue',
}

export const INVOICE_TYPE_LABELS: Record<InvoiceType, string> = {
  stripe: 'Stripe',
  custom: 'Custom',
}

export function formatInvoiceAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)
}

export function formatInvoiceDate(date?: string | null): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function getEffectiveInvoiceStatus(
  invoice: Pick<InvoiceItem, 'status' | 'dueDate'>
): InvoiceStatus {
  if (invoice.status === 'paid') return 'paid'
  if (invoice.status === 'overdue') return 'overdue'
  if (invoice.status === 'pending' && invoice.dueDate) {
    const due = new Date(invoice.dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (due < today) return 'overdue'
  }
  return 'pending'
}

export function invoiceStatusClass(status: string): string {
  switch (status) {
    case 'pending':
      return 'border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400'
    case 'paid':
      return 'border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
    case 'overdue':
      return 'border-transparent bg-red-500/15 text-red-700 dark:text-red-400'
    default:
      return ''
  }
}

export function matchesInvoiceFilter(
  invoice: InvoiceItem,
  filter: 'all' | InvoiceStatus
): boolean {
  if (filter === 'all') return true
  return getEffectiveInvoiceStatus(invoice) === filter
}
