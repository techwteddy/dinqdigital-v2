import { ActivityChart } from '@/components/dashboard/activity-chart'
import { DEMO_CHART_WEEKLY } from '@/lib/demo-data'

export function DemoActivityChart() {
  return (
    <ActivityChart
      data={DEMO_CHART_WEEKLY}
      className="lg:col-span-2"
      title="Weekly activity"
    />
  )
}
