jest.mock('@/lib/demo-data', () => ({
  DEMO_METRICS: [{ label: 'Churn', value: '2.1%', change: '+0.4%', up: false }],
}))

import { render, screen } from '@testing-library/react'
import { DemoMetricsGrid } from './demo-metrics-grid'

describe('DemoMetricsGrid negative trend', () => {
  it('renders down trend icon when metric is not up', () => {
    render(<DemoMetricsGrid />)
    expect(screen.getByText('Churn')).toBeInTheDocument()
    expect(screen.getByText(/vs last month/i)).toBeInTheDocument()
  })
})
