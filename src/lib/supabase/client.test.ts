const mockCreateBrowserClient = jest.fn()

jest.mock('@supabase/ssr', () => ({
  createBrowserClient: (...args: unknown[]) => mockCreateBrowserClient(...args),
}))

import { createClient } from './client'

describe('supabase browser client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCreateBrowserClient.mockReturnValue({ auth: {} })
  })

  it('creates browser client with env keys', () => {
    const client = createClient()
    expect(mockCreateBrowserClient).toHaveBeenCalledWith(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    expect(client).toEqual({ auth: {} })
  })
})
