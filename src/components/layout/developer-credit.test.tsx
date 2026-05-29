import { render, screen } from '@testing-library/react'
import { DeveloperCredit } from './developer-credit'

describe('DeveloperCredit', () => {
  it('renders bar variant by default', () => {
    render(<DeveloperCredit />)
    expect(screen.getByLabelText('Developer credit')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /omar s\. m\. abdelfatah/i })
    ).toHaveAttribute('href', 'https://www.omarsharaf.me')
  })

  it('renders compact variant', () => {
    render(<DeveloperCredit variant="compact" className="mt-4" />)
    expect(screen.getByText(/developed by/i)).toBeInTheDocument()
    expect(screen.queryByLabelText('Developer credit')).not.toBeInTheDocument()
  })
})
