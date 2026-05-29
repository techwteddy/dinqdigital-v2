import { render, screen } from '@testing-library/react'
import { Badge, badgeVariants } from './badge'

describe('Badge', () => {
  it('renders default badge', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('renders all variants', () => {
    const { rerender } = render(<Badge variant="secondary">Secondary</Badge>)
    expect(screen.getByText('Secondary')).toBeInTheDocument()

    rerender(<Badge variant="outline">Outline</Badge>)
    rerender(<Badge variant="success">Success</Badge>)
    expect(badgeVariants({ variant: 'success' })).toContain('emerald')
  })
})
