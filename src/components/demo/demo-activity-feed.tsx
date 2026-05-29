import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { DEMO_ACTIVITY } from '@/lib/demo-data'

export function DemoActivityFeed() {
  return <ActivityFeed items={DEMO_ACTIVITY} viewAllHref="/demo/analytics" />
}
