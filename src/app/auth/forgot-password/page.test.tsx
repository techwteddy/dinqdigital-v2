import { render, screen } from '@testing-library/react'
import ForgotPasswordPage, { metadata } from './page'

jest.mock('@/components/auth/forgot-password-form', () => ({
  ForgotPasswordForm: () => <div data-testid="forgot-form" />,
}))

describe('ForgotPasswordPage', () => {
  it('renders forgot password page', () => {
    render(<ForgotPasswordPage />)
    expect(screen.getByRole('heading', { name: /forgot password/i })).toBeInTheDocument()
    expect(screen.getByTestId('forgot-form')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to sign in/i })).toHaveAttribute(
      'href',
      '/auth/login'
    )
  })

  it('exports metadata', () => {
    expect(metadata.title).toBe('Reset Password')
  })
})
