import { render, screen } from '@testing-library/react'
import LoginPage, { metadata } from './page'

jest.mock('@/components/auth/login-form', () => ({
  LoginForm: () => <div data-testid="login-form" />,
}))

describe('LoginPage', () => {
  it('renders login page content', () => {
    render(<LoginPage />)
    expect(
      screen.getByRole('heading', { name: /welcome back/i })
    ).toBeInTheDocument()
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute(
      'href',
      '/auth/register'
    )
  })

  it('exports metadata', () => {
    expect(metadata.title).toBe('Sign In')
  })
})
