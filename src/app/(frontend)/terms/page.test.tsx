import { render, screen } from '@testing-library/react'
import TermsPage, { metadata } from './page'

describe('TermsPage', () => {
  it('renders terms of service content', () => {
    render(<TermsPage />)
    expect(
      screen.getByRole('heading', { name: /terms of service/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/use of service/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute(
      'href',
      '/'
    )
  })

  it('exports metadata', () => {
    expect(metadata.title).toBe('Terms of Service')
  })
})
