import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DEMO_ACTIVITY } from '@/lib/demo-data'
import { cn } from '@/lib/utils'

const TYPE_STYLES = {
  success: 'bg-emerald-500',
  info: 'bg-primary',
  warning: 'bg-amber-500',
}

export function DemoActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {DEMO_ACTIVITY.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div
              className={cn(
                'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                TYPE_STYLES[item.type]
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{item.action}</p>
              <p className="text-xs text-muted-foreground">
                {item.user} · {item.time}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
