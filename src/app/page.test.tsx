import { render, screen } from '@testing-library/react'
import HomePage from './page'

jest.mock('@/components/layout/theme-toggle', () => ({
  ThemeToggle: () => null,
}))

describe('HomePage', () => {
  it('renders full marketing landing page', () => {
    render(<HomePage />)

    expect(
      screen.getByRole('heading', {
        name: /the smarter way to run, grow, and scale your business/i,
      })
    ).toBeInTheDocument()
    expect(screen.getByText('Real-time analytics')).toBeInTheDocument()
    expect(screen.getAllByText('Slack').length).toBeGreaterThan(0)
    expect(screen.getByText('Create your workspace')).toBeInTheDocument()
    expect(screen.getByText(/ready to transform/i)).toBeInTheDocument()
  })
})
