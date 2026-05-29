import { render, screen } from '@testing-library/react'
import { Input } from './input'

describe('Input', () => {
  it('renders input with type and placeholder', () => {
    render(<Input type="email" placeholder="you@example.com" />)
    const input = screen.getByPlaceholderText('you@example.com')
    expect(input).toHaveAttribute('type', 'email')
  })
})
