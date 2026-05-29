import {
  DEMO_ACTIVITY,
  DEMO_BILLING,
  DEMO_CHART_WEEKLY,
  DEMO_METRICS,
  DEMO_ORG,
  DEMO_ORGANIZATIONS,
  DEMO_USER,
} from './demo-data'

describe('demo-data', () => {
  it('exports demo user and organization fixtures', () => {
    expect(DEMO_USER.initials).toBe('AR')
    expect(DEMO_ORG.plan).toBe('Pro')
    expect(DEMO_ORGANIZATIONS).toHaveLength(2)
  })

  it('exports activity, chart, metrics, and billing fixtures', () => {
    expect(DEMO_ACTIVITY.length).toBeGreaterThan(0)
    expect(DEMO_CHART_WEEKLY).toHaveLength(7)
    expect(DEMO_METRICS).toHaveLength(4)
    expect(DEMO_BILLING.status).toBe('Active')
  })
})
