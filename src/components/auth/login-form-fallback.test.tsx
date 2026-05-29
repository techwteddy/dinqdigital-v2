jest.mock('react', () => {
  const actual = jest.requireActual<typeof import('react')>('react')
  return {
    ...actual,
    Suspense: ({ fallback }: { fallback: React.ReactNode }) => <>{fallback}</>,
  }
})

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({ auth: {} }),
}))

import { render, screen } from '@testing-library/react'
import { LoginForm } from './login-form'

describe('LoginForm suspense fallback', () => {
  it('renders skeleton while the form suspends', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/loading sign-in form/i)).toBeInTheDocument()
  })
})
