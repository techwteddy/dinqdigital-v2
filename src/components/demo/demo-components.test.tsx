import { render, screen } from '@testing-library/react'
import { DemoActivityChart } from './demo-activity-chart'
import { DemoActivityFeed } from './demo-activity-feed'
import { DemoBanner } from './demo-banner'
import { DemoMetricsGrid } from './demo-metrics-grid'

describe('demo components', () => {
  it('renders DemoBanner', () => {
    render(<DemoBanner />)
    expect(screen.getByText(/live demo/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /homepage/i })).toHaveAttribute(
      'href',
      '/'
    )
  })

  it('renders DemoMetricsGrid', () => {
    render(<DemoMetricsGrid />)
    expect(screen.getByText('Active users')).toBeInTheDocument()
  })

  it('renders DemoActivityChart', () => {
    render(<DemoActivityChart />)
    expect(screen.getByText('Weekly activity')).toBeInTheDocument()
    expect(screen.getByText('Mon')).toBeInTheDocument()
  })

  it('renders DemoActivityFeed', () => {
    render(<DemoActivityFeed />)
    expect(screen.getByText('Recent activity')).toBeInTheDocument()
    expect(screen.getByText(/report exported/i)).toBeInTheDocument()
  })
})
