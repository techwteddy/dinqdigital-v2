import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardChartPoint } from '@/lib/dashboard-types'

interface ActivityChartProps {
  title?: string
  data: DashboardChartPoint[]
  className?: string
}

export function ActivityChart({
  title = 'Weekly activity',
  data,
  className,
}: ActivityChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-52 items-end justify-between gap-2 sm:gap-3">
          {data.map((bar) => (
            <div
              key={bar.label}
              className="group flex flex-1 flex-col items-center gap-2"
            >
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-primary to-primary/40 transition-all group-hover:from-violet-600 group-hover:to-primary/60"
                style={{
                  height: `${(bar.value / max) * 100}%`,
                  minHeight: '10px',
                }}
                role="presentation"
              />
              <span className="text-xs text-muted-foreground">{bar.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
