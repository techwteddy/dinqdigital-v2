import { render, screen } from '@testing-library/react'
import { MarketingFooter } from './marketing-footer'

describe('MarketingFooter', () => {
  it('renders footer sections and links', () => {
    render(<MarketingFooter />)
    expect(screen.getByText('Product')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /help center/i })).toHaveAttribute(
      'href',
      expect.stringContaining('/demo')
    )
    expect(screen.getByRole('link', { name: /live demo/i })).toHaveAttribute('href', '/demo')
    expect(screen.getByRole('link', { name: /terms/i })).toHaveAttribute('href', '/terms')
    expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('target', '_blank')
  })
})
