import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DEMO_CHART_WEEKLY } from '@/lib/demo-data'

export function DemoActivityChart() {
  const max = Math.max(...DEMO_CHART_WEEKLY.map((d) => d.value))

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-base">Weekly activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-48 items-end justify-between gap-3">
          {DEMO_CHART_WEEKLY.map((bar) => (
            <div
              key={bar.label}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary/50 transition-all hover:from-violet-600 hover:to-primary"
                style={{
                  height: `${(bar.value / max) * 100}%`,
                  minHeight: '8px',
                }}
              />
              <span className="text-xs text-muted-foreground">{bar.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
