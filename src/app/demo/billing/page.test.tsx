import { render, screen } from '@testing-library/react'
import DemoBillingPage from './page'

describe('DemoBillingPage', () => {
  it('renders demo billing overview', () => {
    render(<DemoBillingPage />)
    expect(
      screen.getByRole('heading', { name: /billing/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/current plan/i)).toBeInTheDocument()
    expect(screen.getByText(/invoice history/i)).toBeInTheDocument()
  })
})
