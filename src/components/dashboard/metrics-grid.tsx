import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { DashboardMetric } from '@/lib/dashboard-types'
import { cn } from '@/lib/utils'

interface MetricsGridProps {
  metrics: DashboardMetric[]
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card
          key={metric.label}
          className="overflow-hidden border-border/80 transition-shadow hover:shadow-md"
        >
          <CardContent className="p-5">
            <p className="text-sm font-medium text-muted-foreground">
              {metric.label}
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight">
              {metric.value}
            </p>
            <p
              className={cn(
                'mt-2 flex items-center gap-1 text-xs font-medium',
                metric.up
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-muted-foreground'
              )}
            >
              {metric.up ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 opacity-50" />
              )}
              {metric.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
