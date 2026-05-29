import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardActivityItem } from '@/lib/dashboard-types'
import { cn } from '@/lib/utils'

const TYPE_STYLES = {
  success: 'bg-emerald-500',
  info: 'bg-primary',
  warning: 'bg-amber-500',
}

interface ActivityFeedProps {
  items: DashboardActivityItem[]
  viewAllHref?: string
}

export function ActivityFeed({ items, viewAllHref }: ActivityFeedProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base">Recent activity</CardTitle>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-xs font-medium text-primary hover:underline"
          >
            View all
          </Link>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div
              className={cn(
                'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                TYPE_STYLES[item.type]
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-snug">{item.action}</p>
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
