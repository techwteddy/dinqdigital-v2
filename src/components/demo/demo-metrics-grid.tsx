import { MetricsGrid } from '@/components/dashboard/metrics-grid'
import { DEMO_METRICS } from '@/lib/demo-data'

export function DemoMetricsGrid() {
  return <MetricsGrid metrics={DEMO_METRICS} />
}
