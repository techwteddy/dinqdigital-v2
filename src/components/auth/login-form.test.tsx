import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createMockSupabaseAuth } from '@/test-utils'

const mockPush = jest.fn()
const mockRefresh = jest.fn()
const mockCreateClient = jest.fn()

const mockSearchParams = new URLSearchParams('redirectTo=/dashboard/settings')

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
  useSearchParams: () => mockSearchParams,
}))

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => mockCreateClient(),
}))

import { LoginForm } from './login-form'

describe('LoginForm', () => {
  const signInWithPassword = jest.fn()
  const signInWithOAuth = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    signInWithPassword.mockResolvedValue({ error: null })
    signInWithOAuth.mockResolvedValue({ error: null })
    mockCreateClient.mockReturnValue({
      auth: createMockSupabaseAuth({ signInWithPassword, signInWithOAuth }),
    })
  })

  it('renders form fields', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
  })

  it('submits valid credentials', async () => {
    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'password' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      })
      expect(mockPush).toHaveBeenCalledWith('/dashboard/settings')
    })
  })

  it('shows error for invalid credentials', async () => {
    signInWithPassword.mockResolvedValue({
      error: { message: 'Invalid login credentials' },
    })
    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'wrong' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
    })
  })

  it('shows generic auth error message', async () => {
    signInWithPassword.mockResolvedValue({ error: { message: 'Server error' } })
    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'password' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument()
    })
  })

  it('toggles password visibility', () => {
    render(<LoginForm />)

    const passwordInput = screen.getByLabelText(/^password$/i)
    expect(passwordInput).toHaveAttribute('type', 'password')

    fireEvent.click(screen.getByLabelText(/show password/i))
    expect(passwordInput).toHaveAttribute('type', 'text')

    fireEvent.click(screen.getByLabelText(/hide password/i))
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('uses default redirect when search param is absent', async () => {
    mockSearchParams.delete('redirectTo')
    signInWithPassword.mockResolvedValue({ error: null })

    render(<LoginForm />)
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'password' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
    mockSearchParams.set('redirectTo', '/dashboard/settings')
  })

  it('initiates OAuth sign in', () => {
    render(<LoginForm />)

    fireEvent.click(screen.getByRole('button', { name: /google/i }))
    expect(signInWithOAuth).toHaveBeenCalledWith(
      expect.objectContaining({ provider: 'google' })
    )
  })

  it('shows OAuth error', async () => {
    signInWithOAuth.mockResolvedValue({ error: { message: 'OAuth failed' } })
    render(<LoginForm />)

    fireEvent.click(screen.getByRole('button', { name: /github/i }))
    await waitFor(() => {
      expect(screen.getByText('OAuth failed')).toBeInTheDocument()
    })
  })
})
