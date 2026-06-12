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
        name: /the smarter way to build, launch, and grow your business/i,
      })
    ).toBeInTheDocument()
    expect(screen.getByText('Premium Web Design')).toBeInTheDocument()
    expect(screen.getAllByText('Claude AI').length).toBeGreaterThan(0)
    expect(screen.getByText('Start your project')).toBeInTheDocument()
    expect(
      screen.getByText(/ready to build something great/i)
    ).toBeInTheDocument()
  })
})
