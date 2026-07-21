/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { mockUser } from '@/test-utils'

const mockRequireAuthApi = jest.fn()
const mockUpsertPrismaUser = jest.fn()
const mockCreateOrganization = jest.fn()

jest.mock('@/lib/auth', () => ({
  requireAuthApi: (...args: unknown[]) => mockRequireAuthApi(...args),
}))

jest.mock('@/lib/auth/sync-user', () => ({
  upsertPrismaUser: (...args: unknown[]) => mockUpsertPrismaUser(...args),
}))

jest.mock('@/lib/organizations', () => ({
  createOrganization: (...args: unknown[]) => mockCreateOrganization(...args),
}))

import { POST } from './route'
import { AuthError } from '@/lib/errors'

describe('POST /api/organizations', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRequireAuthApi.mockResolvedValue(mockUser)
    mockUpsertPrismaUser.mockResolvedValue({ id: mockUser.id })
    mockCreateOrganization.mockResolvedValue({
      id: 'org-1',
      name: 'Acme',
      slug: 'acme',
    })
  })

  it('upserts the Prisma user before creating the organization', async () => {
    const request = new NextRequest('http://localhost:3000/api/organizations', {
      method: 'POST',
      body: JSON.stringify({ name: 'Acme', slug: 'acme' }),
      headers: { 'content-type': 'application/json' },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(mockUpsertPrismaUser).toHaveBeenCalledWith(mockUser)
    expect(mockCreateOrganization).toHaveBeenCalledWith({
      userId: mockUser.id,
      name: 'Acme',
      slug: 'acme',
    })
    expect(mockUpsertPrismaUser.mock.invocationCallOrder[0]).toBeLessThan(
      mockCreateOrganization.mock.invocationCallOrder[0]
    )
    expect(response.status).toBe(201)
    expect(body.organization.slug).toBe('acme')
  })

  it('returns 401 when unauthenticated', async () => {
    mockRequireAuthApi.mockRejectedValue(new AuthError())

    const request = new NextRequest('http://localhost:3000/api/organizations', {
      method: 'POST',
      body: JSON.stringify({ name: 'Acme', slug: 'acme' }),
      headers: { 'content-type': 'application/json' },
    })

    const response = await POST(request)
    expect(response.status).toBe(401)
    expect(mockUpsertPrismaUser).not.toHaveBeenCalled()
  })
})
