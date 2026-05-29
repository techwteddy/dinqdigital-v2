import { render, screen } from '@testing-library/react'
import RegisterPage, { metadata } from './page'

jest.mock('@/components/auth/register-form', () => ({
  RegisterForm: () => <div data-testid="register-form" />,
}))

describe('RegisterPage', () => {
  it('renders register page content', () => {
    render(<RegisterPage />)
    expect(
      screen.getByRole('heading', { name: /create an account/i })
    ).toBeInTheDocument()
    expect(screen.getByTestId('register-form')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute(
      'href',
      '/auth/login'
    )
    expect(screen.getByRole('link', { name: /terms/i })).toHaveAttribute(
      'href',
      '/terms'
    )
  })

  it('exports metadata', () => {
    expect(metadata.title).toBe('Create Account')
  })
})
