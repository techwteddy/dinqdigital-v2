jest.mock('@/lib/site', () => ({
  ...jest.requireActual('@/lib/site'),
  SHOW_DEVELOPER_CREDIT: false,
}))

import { render, screen } from '@testing-library/react'
import { MarketingFooter } from './marketing-footer'

describe('MarketingFooter without developer credit', () => {
  it('hides developer credit when disabled', () => {
    render(<MarketingFooter />)
    expect(screen.queryByText(/developed by/i)).not.toBeInTheDocument()
  })
})
