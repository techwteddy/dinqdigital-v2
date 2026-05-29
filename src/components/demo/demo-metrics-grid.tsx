import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { DEMO_METRICS } from '@/lib/demo-data'
import { cn } from '@/lib/utils'

export function DemoMetricsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {DEMO_METRICS.map((metric) => (
        <Card key={metric.label} className="overflow-hidden">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight">{metric.value}</p>
            <p
              className={cn(
                'mt-2 flex items-center gap-1 text-xs font-medium',
                metric.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
              )}
            >
              {metric.up ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              {metric.change} vs last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
