import type { Metadata } from 'next'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  formatAdminDate,
  formatCurrency,
  formatDealStage,
  getDealClientName,
  getDeals,
  type DealDoc,
} from '@/lib/admin'

export const metadata: Metadata = { title: 'Deal Pipeline' }

const PIPELINE_COLUMNS = [
  { key: 'discovery', label: 'Pending' },
  { key: 'proposal', label: 'Contacting' },
  { key: 'won', label: 'Won' },
  { key: 'lost', label: 'Lost' },
] as const

function groupDeals(deals: DealDoc[]) {
  return PIPELINE_COLUMNS.map((column) => ({
    ...column,
    deals: deals.filter((deal) => (deal.stage || 'discovery') === column.key),
  }))
}

export default async function AdminDealsPage() {
  const { docs } = await getDeals(100)
  const columns = groupDeals(docs)

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Deal Pipeline"
        description="Track discovery through close across your agency deals."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((column) => (
          <div key={column.key} className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold">{column.label}</h2>
              <Badge variant="secondary">{column.deals.length}</Badge>
            </div>
            <div className="flex min-h-[220px] flex-col gap-3 rounded-xl border border-border bg-muted/20 p-3">
              {column.deals.length === 0 ? (
                <p className="px-1 py-8 text-center text-xs text-muted-foreground">
                  No deals
                </p>
              ) : (
                column.deals.map((deal) => (
                  <Card
                    key={String(deal.id)}
                    className="transition-all hover:border-primary/20 hover:shadow-md"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        {getDealClientName(deal)}
                      </CardTitle>
                      <CardDescription>
                        {formatDealStage(deal.stage)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-1 text-xs text-muted-foreground">
                      <p className="text-sm font-semibold text-foreground">
                        {formatCurrency(deal.value)}
                      </p>
                      <p>
                        {deal.startDate
                          ? formatAdminDate(deal.startDate)
                          : formatAdminDate(deal.createdAt)}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
