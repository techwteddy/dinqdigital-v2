jest.mock('@/lib/demo-data', () => ({
  ...jest.requireActual('@/lib/demo-data'),
  DEMO_ORGANIZATIONS: [
    {
      id: '99',
      name: 'Inactive Co',
      role: 'member' as const,
      members: 1,
      plan: 'Starter',
      active: false,
      renewsIn: '5 days',
    },
  ],
}))

import { render, screen } from '@testing-library/react'
import DemoDashboardPage from './page'

describe('DemoDashboardPage inactive org', () => {
  it('renders secondary badge for inactive workspace', () => {
    render(<DemoDashboardPage />)
    expect(screen.getByText('Inactive Co')).toBeInTheDocument()
    expect(screen.getByText('Starter')).toBeInTheDocument()
  })
})
