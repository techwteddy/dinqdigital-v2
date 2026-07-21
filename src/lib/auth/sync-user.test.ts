/**
 * @jest-environment node
 */
const mockUpsert = jest.fn()

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: { upsert: (...args: unknown[]) => mockUpsert(...args) },
  },
}))

import { upsertPrismaUser } from './sync-user'

describe('upsertPrismaUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUpsert.mockResolvedValue({ id: 'user-123', email: 'test@example.com' })
  })

  it('upserts using the Supabase auth user id and email', async () => {
    await upsertPrismaUser({
      id: 'user-123',
      email: 'test@example.com',
      email_confirmed_at: '2026-01-01T00:00:00.000Z',
      user_metadata: {
        full_name: 'Test User',
        avatar_url: 'https://avatar.png',
      },
    })

    expect(mockUpsert).toHaveBeenCalledWith({
      where: { id: 'user-123' },
      create: {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        avatarUrl: 'https://avatar.png',
        emailVerified: true,
      },
      update: {
        email: 'test@example.com',
        name: 'Test User',
        avatarUrl: 'https://avatar.png',
        emailVerified: true,
      },
    })
  })

  it('throws when the Supabase user has no email', async () => {
    await expect(
      upsertPrismaUser({ id: 'user-123', email: null })
    ).rejects.toThrow('Supabase user is missing an email address')
    expect(mockUpsert).not.toHaveBeenCalled()
  })
})
