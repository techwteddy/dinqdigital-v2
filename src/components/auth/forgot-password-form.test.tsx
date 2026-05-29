import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createMockSupabaseAuth } from '@/test-utils'

const mockCreateClient = jest.fn()

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => mockCreateClient(),
}))

import { ForgotPasswordForm } from './forgot-password-form'

describe('ForgotPasswordForm', () => {
  const resetPasswordForEmail = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    resetPasswordForEmail.mockResolvedValue({ error: null })
    mockCreateClient.mockReturnValue({
      auth: createMockSupabaseAuth({ resetPasswordForEmail }),
    })
  })

  it('sends reset email on submit', async () => {
    render(<ForgotPasswordForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }))

    await waitFor(() => {
      expect(resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        expect.objectContaining({
          redirectTo: expect.stringContaining('/auth/reset-password'),
        })
      )
      expect(screen.getByText(/reset link sent/i)).toBeInTheDocument()
    })
  })

  it('shows error on failure', async () => {
    resetPasswordForEmail.mockResolvedValue({
      error: { message: 'Rate limited' },
    })
    render(<ForgotPasswordForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }))

    await waitFor(() => {
      expect(screen.getByText('Rate limited')).toBeInTheDocument()
    })
  })
})
