/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'

jest.mock('@/lib/auth/handle-callback', () => ({
  handleAuthCallback: jest.fn(),
}))

import { handleAuthCallback } from '@/lib/auth/handle-callback'
import { GET } from './route'

const mockHandle = handleAuthCallback as jest.MockedFunction<
  typeof handleAuthCallback
>

describe('GET /auth/callback', () => {
  it('delegates to shared auth callback handler', async () => {
    const request = new NextRequest(
      new URL('http://localhost:3000/auth/callback?token_hash=abc&type=signup')
    )
    mockHandle.mockResolvedValue(new Response(null, { status: 307 }) as never)

    await GET(request)

    expect(mockHandle).toHaveBeenCalledWith(request)
  })
})
