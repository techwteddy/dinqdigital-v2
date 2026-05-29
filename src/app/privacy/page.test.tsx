import { render, screen } from '@testing-library/react'
import PrivacyPage, { metadata } from './page'

describe('PrivacyPage', () => {
  it('renders privacy policy content', () => {
    render(<PrivacyPage />)
    expect(
      screen.getByRole('heading', { name: /privacy policy/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/information we collect/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute(
      'href',
      '/'
    )
  })

  it('exports metadata', () => {
    expect(metadata.title).toBe('Privacy Policy')
  })
})
