/** @jest-environment node */

import { NextRequest } from 'next/server'

const mockRequireAuthApi = jest.fn()
const mockFindFirst = jest.fn()

jest.mock('@/lib/auth', () => ({
  requireAuthApi: () => mockRequireAuthApi(),
}))

jest.mock('@/lib/prisma', () => ({
  prisma: {
    organizationMember: {
      findFirst: (...args: unknown[]) => mockFindFirst(...args),
    },
  },
}))

import { GET } from './route'
import { mockUser } from '@/test-utils'
import { AuthError } from '@/lib/errors'

describe('GET /api/organizations/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRequireAuthApi.mockResolvedValue(mockUser)
  })

  it('returns organization for member', async () => {
    const org = { id: 'org-1', name: 'Acme', subscription: null }
    mockFindFirst.mockResolvedValue({ organization: org })

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ id: 'org-1' }),
    })

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual(org)
  })

  it('returns 404 when not a member', async () => {
    mockFindFirst.mockResolvedValue(null)

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ id: 'org-1' }),
    })

    expect(response.status).toBe(404)
  })

  it('returns 401 when unauthenticated', async () => {
    mockRequireAuthApi.mockRejectedValue(new AuthError())

    const response = await GET(new NextRequest('http://localhost'), {
      params: Promise.resolve({ id: 'org-1' }),
    })

    expect(response.status).toBe(401)
  })
})
