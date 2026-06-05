import { render, screen } from '@testing-library/react'
import { MarketingFooter } from './marketing-footer'

describe('MarketingFooter', () => {
  it('renders copyright notice', () => {
    render(<MarketingFooter />)
    expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument()
  })
})
