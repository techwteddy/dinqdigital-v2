import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { MetricsGrid } from '@/components/dashboard/metrics-grid'
import { ActivityChart } from '@/components/dashboard/activity-chart'
import {
  DEMO_ANALYTICS,
  DEMO_CHART_WEEKLY,
  DEMO_METRICS,
} from '@/lib/demo-data'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function DemoAnalyticsPage() {
  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        isDemo
        title="Analytics"
        description="Traffic, conversion, and engagement — sample metrics for preview."
        action={{ label: 'Start free trial', href: '/auth/register' }}
      />

      <MetricsGrid metrics={DEMO_METRICS} />

      <div className="grid gap-6 lg:grid-cols-3">
        <ActivityChart
          data={DEMO_CHART_WEEKLY}
          title="Sessions this week"
          className="lg:col-span-2"
        />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Key metrics</CardTitle>
            <CardDescription>vs previous 30 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Conversion rate</p>
              <p className="text-xl font-bold">
                {DEMO_ANALYTICS.conversionRate}
              </p>
              <p className="text-xs text-emerald-600">
                {DEMO_ANALYTICS.conversionChange}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Sessions</p>
              <p className="text-xl font-bold">{DEMO_ANALYTICS.sessions}</p>
              <p className="text-xs text-emerald-600">
                {DEMO_ANALYTICS.sessionsChange}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Bounce rate</p>
              <p className="text-xl font-bold">{DEMO_ANALYTICS.bounceRate}</p>
              <p className="text-xs text-emerald-600">
                {DEMO_ANALYTICS.bounceChange}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top traffic sources</CardTitle>
          <CardDescription>Where your visitors come from</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {DEMO_ANALYTICS.topSources.map((row) => (
            <div key={row.source} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{row.source}</span>
                <span className="text-muted-foreground">
                  {row.visits.toLocaleString()} ({row.percent}%)
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${row.percent}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
