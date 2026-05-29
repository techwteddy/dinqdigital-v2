import type { ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'

export function createMockSupabaseAuth(overrides: Record<string, unknown> = {}) {
  return {
    getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
    signInWithPassword: jest.fn().mockResolvedValue({ error: null }),
    signInWithOAuth: jest.fn().mockResolvedValue({ error: null }),
    signUp: jest.fn().mockResolvedValue({ error: null }),
    resetPasswordForEmail: jest.fn().mockResolvedValue({ error: null }),
    exchangeCodeForSession: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
    onAuthStateChange: jest.fn().mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    }),
    ...overrides,
  }
}

export function createMockSupabaseClient(auth = createMockSupabaseAuth()) {
  return { auth }
}

export const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: { full_name: 'Test User' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
}

export const mockDbUser = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  avatarUrl: null,
  emailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const mockOrganization = {
  id: 'org-123',
  name: 'Test Org',
  slug: 'test-org',
  logoUrl: null,
  stripeCustomerId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, options)
}
