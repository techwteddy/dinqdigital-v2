'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { MetricsGrid } from '@/components/dashboard/metrics-grid'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { DashboardMetric } from '@/lib/dashboard-types'
import {
  formatInvoiceAmount,
  formatInvoiceDate,
  getEffectiveInvoiceStatus,
  INVOICE_STATUS_LABELS,
  INVOICE_TYPE_LABELS,
  invoiceStatusClass,
  matchesInvoiceFilter,
  type InvoiceItem,
  type InvoiceStatus,
  type InvoiceType,
} from '@/lib/invoices'
import { cn } from '@/lib/utils'

type InvoiceFormState = {
  orgId: string
  clientEmail: string
  title: string
  amount: string
  type: InvoiceType
  dueDate: string
  notes: string
}

const EMPTY_FORM: InvoiceFormState = {
  orgId: '',
  clientEmail: '',
  title: '',
  amount: '',
  type: 'stripe',
  dueDate: '',
  notes: '',
}

const FILTERS: Array<{ key: 'all' | InvoiceStatus; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'paid', label: 'Paid' },
  { key: 'overdue', label: 'Overdue' },
]

function toIsoDate(date: string) {
  if (!date) return null
  return new Date(`${date}T12:00:00.000Z`).toISOString()
}

export function AdminInvoicesPanel() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([])
  const [filter, setFilter] = useState<'all' | InvoiceStatus>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [form, setForm] = useState<InvoiceFormState>(EMPTY_FORM)

  const loadInvoices = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/invoices')
      if (!response.ok) throw new Error('Failed to load invoices')
      const data = (await response.json()) as { invoices: InvoiceItem[] }
      setInvoices(data.invoices)
    } catch {
      setError('Could not load invoices.')
      setInvoices([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadInvoices()
  }, [loadInvoices])

  const filtered = useMemo(
    () => invoices.filter((invoice) => matchesInvoiceFilter(invoice, filter)),
    [invoices, filter]
  )

  const metrics = useMemo((): DashboardMetric[] => {
    let revenue = 0
    let pendingCount = 0
    let pendingAmount = 0
    let paidCount = 0
    let overdueCount = 0

    for (const invoice of invoices) {
      const status = getEffectiveInvoiceStatus(invoice)
      if (status === 'paid') {
        revenue += invoice.amount
        paidCount += 1
      } else if (status === 'pending') {
        pendingCount += 1
        pendingAmount += invoice.amount
      } else if (status === 'overdue') {
        overdueCount += 1
      }
    }

    return [
      {
        label: 'Total Revenue',
        value: formatInvoiceAmount(revenue),
        change: 'Sum of paid invoices',
        up: revenue > 0,
      },
      {
        label: 'Pending',
        value: String(pendingCount),
        change: formatInvoiceAmount(pendingAmount) + ' pending',
        up: pendingCount > 0,
      },
      {
        label: 'Paid',
        value: String(paidCount),
        change: 'Paid invoices',
        up: paidCount > 0,
      },
      {
        label: 'Overdue',
        value: String(overdueCount),
        change: 'Past due invoices',
        up: overdueCount > 0,
      },
    ]
  }, [invoices])

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const amount = Number(form.amount)
      if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error('Invalid amount')
      }

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId: form.orgId.trim(),
          clientEmail: form.clientEmail.trim(),
          title: form.title.trim(),
          amount,
          type: form.type,
          dueDate: toIsoDate(form.dueDate),
          notes: form.notes.trim() || null,
        }),
      })
      if (!response.ok) throw new Error('Failed to create invoice')
      setOpen(false)
      setForm(EMPTY_FORM)
      await loadInvoices()
    } catch {
      setError('Could not create invoice.')
    } finally {
      setSaving(false)
    }
  }

  async function markAsPaid(invoice: InvoiceItem) {
    setUpdatingId(invoice.id)
    setError(null)
    try {
      const response = await fetch(`/api/invoices/${invoice.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paid' }),
      })
      if (!response.ok) throw new Error('Failed to mark paid')
      await loadInvoices()
    } catch {
      setError('Could not mark invoice as paid.')
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleDelete(invoice: InvoiceItem) {
    if (!window.confirm(`Delete invoice "${invoice.title}"?`)) return
    setUpdatingId(invoice.id)
    setError(null)
    try {
      const response = await fetch(`/api/invoices/${invoice.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete invoice')
      await loadInvoices()
    } catch {
      setError('Could not delete invoice.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <MetricsGrid metrics={metrics} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <Button
              key={item.key}
              type="button"
              size="sm"
              variant={filter === item.key ? 'default' : 'outline'}
              onClick={() => setFilter(item.key)}
            >
              {item.label}
            </Button>
          ))}
        </div>
        <Button
          type="button"
          onClick={() => {
            setForm(EMPTY_FORM)
            setOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Client</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-muted-foreground"
                >
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading invoices…
                  </span>
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-muted-foreground"
                >
                  No invoices yet.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((invoice) => {
                const status = getEffectiveInvoiceStatus(invoice)
                const type = (invoice.type || 'stripe') as InvoiceType
                const canMarkPaid =
                  type === 'custom' &&
                  (invoice.status === 'pending' || status === 'pending')
                return (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <p className="font-medium">{invoice.clientEmail}</p>
                      <p className="text-xs text-muted-foreground">
                        {invoice.orgId}
                      </p>
                    </TableCell>
                    <TableCell className="font-medium">{invoice.title}</TableCell>
                    <TableCell>{formatInvoiceAmount(invoice.amount)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {INVOICE_TYPE_LABELS[type] ?? invoice.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(invoiceStatusClass(status))}
                        variant="outline"
                      >
                        {INVOICE_STATUS_LABELS[status] ?? status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatInvoiceDate(invoice.dueDate)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex flex-wrap items-center justify-end gap-2">
                        {canMarkPaid && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={updatingId === invoice.id}
                            onClick={() => void markAsPaid(invoice)}
                          >
                            {updatingId === invoice.id && (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            )}
                            Mark as Paid
                          </Button>
                        )}
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          disabled={updatingId === invoice.id}
                          onClick={() => void handleDelete(invoice)}
                          aria-label="Delete invoice"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
            <DialogDescription>
              Create an invoice for a client organization and notify them.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="orgId" className="text-sm font-medium">
                Org ID
              </label>
              <Input
                id="orgId"
                required
                value={form.orgId}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    orgId: event.target.value,
                  }))
                }
                placeholder="Organization ID"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="clientEmail" className="text-sm font-medium">
                Client Email
              </label>
              <Input
                id="clientEmail"
                type="email"
                required
                value={form.clientEmail}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    clientEmail: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                required
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium">
                  Amount
                </label>
                <Input
                  id="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={form.amount}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      amount: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={form.type}
                  onValueChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      type: value as InvoiceType,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-medium">
                Due Date
              </label>
              <Input
                id="dueDate"
                type="date"
                value={form.dueDate}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    dueDate: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Notes
              </label>
              <textarea
                id="notes"
                rows={3}
                value={form.notes}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    notes: event.target.value,
                  }))
                }
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  saving ||
                  !form.orgId.trim() ||
                  !form.clientEmail.trim() ||
                  !form.title.trim() ||
                  !form.amount
                }
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Create invoice
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
