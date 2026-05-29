const mockCreateServerClient = jest.fn()
const mockAdminCreate = jest.fn()

jest.mock('@supabase/ssr', () => ({
  createServerClient: (...args: unknown[]) => mockCreateServerClient(...args),
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

jest.mock('@supabase/supabase-js', () => ({
  createClient: (...args: unknown[]) => mockAdminCreate(...args),
}))

import { cookies } from 'next/headers'
import { createAdminClient, createClient } from './server'

const mockCookies = cookies as jest.MockedFunction<typeof cookies>

describe('supabase server client', () => {
  const mockCookieStore = {
    getAll: jest.fn().mockReturnValue([]),
    set: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockCookies.mockResolvedValue(mockCookieStore as never)
    mockCreateServerClient.mockReturnValue({ auth: {} })
    mockAdminCreate.mockReturnValue({ auth: { admin: true } })
  })

  it('creates server client with cookie handlers', async () => {
    const client = await createClient()
    expect(mockCreateServerClient).toHaveBeenCalledWith(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      expect.objectContaining({ cookies: expect.any(Object) })
    )
    expect(client).toEqual({ auth: {} })

    const config = mockCreateServerClient.mock.calls[0][2] as {
      cookies: { getAll: () => unknown; setAll: (c: unknown[]) => void }
    }
    expect(config.cookies.getAll()).toEqual([])
    config.cookies.setAll([{ name: 'a', value: 'b', options: {} }])
    expect(mockCookieStore.set).toHaveBeenCalledWith('a', 'b', {})
  })

  it('ignores cookie set errors in server components', async () => {
    mockCookieStore.set.mockImplementation(() => {
      throw new Error('read-only')
    })
    await createClient()
    const config = mockCreateServerClient.mock.calls[0][2] as {
      cookies: { setAll: (c: unknown[]) => void }
    }
    expect(() =>
      config.cookies.setAll([{ name: 'a', value: 'b', options: {} }])
    ).not.toThrow()
  })

  it('creates admin client with service role', () => {
    const client = createAdminClient()
    expect(mockAdminCreate).toHaveBeenCalledWith(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      expect.objectContaining({
        auth: { autoRefreshToken: false, persistSession: false },
      })
    )
    expect(client).toEqual({ auth: { admin: true } })
  })
})
