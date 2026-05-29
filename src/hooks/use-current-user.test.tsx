import { renderHook, waitFor } from '@testing-library/react'
import { createMockSupabaseAuth, mockUser } from '@/test-utils'

const mockCreateClient = jest.fn()

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => mockCreateClient(),
}))

import { useCurrentUser } from './use-current-user'

describe('useCurrentUser', () => {
  let authChangeCallback: (event: string, session: { user: typeof mockUser } | null) => void

  beforeEach(() => {
    jest.clearAllMocks()
    const auth = createMockSupabaseAuth({
      getUser: jest.fn().mockResolvedValue({ data: { user: mockUser } }),
      onAuthStateChange: jest.fn((callback) => {
        authChangeCallback = callback
        return { data: { subscription: { unsubscribe: jest.fn() } } }
      }),
    })
    mockCreateClient.mockReturnValue({ auth })
  })

  it('loads current user on mount', async () => {
    const { result } = renderHook(() => useCurrentUser())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.user).toEqual(mockUser)
  })

  it('updates user on auth state change', async () => {
    const { result } = renderHook(() => useCurrentUser())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    authChangeCallback('SIGNED_IN', { user: mockUser })

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser)
    })

    authChangeCallback('SIGNED_OUT', null)

    await waitFor(() => {
      expect(result.current.user).toBeNull()
    })
  })

  it('unsubscribes on unmount', async () => {
    const unsubscribe = jest.fn()
    const auth = createMockSupabaseAuth({
      getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe } },
      })),
    })
    mockCreateClient.mockReturnValue({ auth })

    const { unmount } = renderHook(() => useCurrentUser())
    await waitFor(() => {
      expect(unsubscribe).not.toHaveBeenCalled()
    })
    unmount()
    expect(unsubscribe).toHaveBeenCalled()
  })
})
