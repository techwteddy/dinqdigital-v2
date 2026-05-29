import { render, screen } from '@testing-library/react'
import { Button, buttonVariants } from './button'

describe('Button', () => {
  it('renders default button', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('renders variants and sizes', () => {
    const { rerender } = render(
      <Button variant="destructive" size="sm">
        Delete
      </Button>
    )
    expect(screen.getByRole('button')).toHaveClass('bg-destructive')

    rerender(
      <Button variant="outline" size="lg">
        Outline
      </Button>
    )
    expect(screen.getByRole('button')).toHaveClass('border')

    rerender(
      <Button variant="secondary" size="icon" aria-label="icon">
        I
      </Button>
    )
    expect(screen.getByLabelText('icon')).toHaveClass('h-10')

    rerender(<Button variant="ghost">Ghost</Button>)
    rerender(<Button variant="link">Link</Button>)
    expect(buttonVariants({ variant: 'link' })).toContain('underline')
  })

  it('renders as child slot', () => {
    render(
      <Button asChild>
        <a href="/test">Link button</a>
      </Button>
    )
    expect(screen.getByRole('link', { name: 'Link button' })).toBeInTheDocument()
  })
})
