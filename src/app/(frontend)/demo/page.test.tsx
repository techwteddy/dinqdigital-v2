import { render, screen } from '@testing-library/react'
import DemoDashboardPage from './page'

jest.mock('@/components/dashboard/dashboard-shell', () => ({
  DashboardShell: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

describe('DemoDashboardPage', () => {
  it('renders demo dashboard content', () => {
    render(<DemoDashboardPage />)
    expect(screen.getByText(/good morning, alex/i)).toBeInTheDocument()
    expect(screen.getByText('Weekly activity')).toBeInTheDocument()
    expect(screen.getByText('Acme Corporation')).toBeInTheDocument()
  })
})
