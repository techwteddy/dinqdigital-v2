'use client'

import { useCallback, useEffect, useState } from 'react'
import { FileText, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  formatInvoiceAmount,
  formatInvoiceDate,
  getEffectiveInvoiceStatus,
  INVOICE_STATUS_LABELS,
  INVOICE_TYPE_LABELS,
  invoiceStatusClass,
  type InvoiceItem,
  type InvoiceStatus,
  type InvoiceType,
} from '@/lib/invoices'
import { cn } from '@/lib/utils'

type ClientInvoicesPanelProps = {
  orgId: string
}

export function ClientInvoicesPanel({ orgId }: ClientInvoicesPanelProps) {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadInvoices = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `/api/invoices?orgId=${encodeURIComponent(orgId)}`
      )
      if (!response.ok) throw new Error('Failed to load invoices')
      const data = (await response.json()) as { invoices: InvoiceItem[] }
      setInvoices(data.invoices)
    } catch {
      setError('Could not load invoices.')
      setInvoices([])
    } finally {
      setLoading(false)
    }
  }, [orgId])

  useEffect(() => {
    void loadInvoices()
  }, [loadInvoices])

  if (loading) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-center gap-2 py-14 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading invoices…
        </CardContent>
      </Card>
    )
  }

  if (invoices.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center py-14 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <FileText className="h-7 w-7 text-primary" />
          </div>
          <p className="text-base font-semibold">No invoices yet</p>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Ted will send your first invoice when your project is ready.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="grid gap-3">
        {invoices.map((invoice) => {
          const status = getEffectiveInvoiceStatus(invoice)
          const type = (invoice.type || 'stripe') as InvoiceType
          return (
            <Card key={invoice.id}>
              <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0 p-4 pb-2">
                <div className="min-w-0 space-y-1">
                  <CardTitle className="text-base font-bold">
                    {invoice.title}
                  </CardTitle>
                  <p className="text-xl font-semibold tracking-tight">
                    {formatInvoiceAmount(invoice.amount)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    className={cn(invoiceStatusClass(status))}
                    variant="outline"
                  >
                    {INVOICE_STATUS_LABELS[status as InvoiceStatus] ?? status}
                  </Badge>
                  <Badge variant="secondary">
                    {INVOICE_TYPE_LABELS[type] ?? invoice.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 px-4 pb-4 pt-0">
                <p className="text-xs text-muted-foreground">
                  Due {formatInvoiceDate(invoice.dueDate)}
                </p>

                {invoice.notes && (
                  <p className="text-sm text-muted-foreground">{invoice.notes}</p>
                )}

                {status === 'paid' && (
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    Paid on {formatInvoiceDate(invoice.paidAt)}
                  </p>
                )}

                {status === 'pending' && type === 'stripe' && (
                  <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-3">
                    <Button type="button" disabled>
                      Pay Now
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Online payment coming soon
                    </p>
                  </div>
                )}

                {status === 'pending' && type === 'custom' && (
                  <div className="rounded-lg border border-border bg-muted/20 p-3 text-sm text-muted-foreground">
                    Ted will reach out with payment instructions. Your invoice
                    will be marked as paid once payment is confirmed.
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
