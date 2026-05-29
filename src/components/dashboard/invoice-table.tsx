import { Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { DashboardInvoice } from '@/lib/dashboard-types'

const STATUS_VARIANT = {
  paid: 'success',
  pending: 'secondary',
  failed: 'outline',
} as const

interface InvoiceTableProps {
  invoices: DashboardInvoice[]
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[480px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3 sm:px-5">Invoice</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right sm:px-5"> </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {invoices.map((inv) => (
            <tr key={inv.id} className="transition-colors hover:bg-muted/20">
              <td className="px-4 py-3.5 sm:px-5">
                <p className="font-medium">{inv.description}</p>
                <p className="text-xs text-muted-foreground">{inv.id}</p>
              </td>
              <td className="px-4 py-3.5 text-muted-foreground">{inv.date}</td>
              <td className="px-4 py-3.5 font-medium">{inv.amount}</td>
              <td className="px-4 py-3.5">
                <Badge
                  variant={STATUS_VARIANT[inv.status]}
                  className="capitalize"
                >
                  {inv.status}
                </Badge>
              </td>
              <td className="px-4 py-3.5 text-right sm:px-5">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Download invoice"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
