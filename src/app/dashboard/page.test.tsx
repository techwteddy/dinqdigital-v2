import { render, screen } from '@testing-library/react'
import { mockUser } from '@/test-utils'

const mockRequireAuth = jest.fn()
const mockFindUnique = jest.fn()

jest.mock('@/lib/auth', () => ({
  requireAuth: () => mockRequireAuth(),
}))

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: { findUnique: (...args: unknown[]) => mockFindUnique(...args) },
  },
}))

import DashboardPage, { metadata } from './page'

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRequireAuth.mockResolvedValue(mockUser)
  })

  it('renders greeting when user record is missing', async () => {
    mockFindUnique.mockResolvedValue(null)
    const page = await DashboardPage()
    render(page)
    expect(screen.getByText(/welcome back, there/i)).toBeInTheDocument()
  })

  it('renders empty state when no organizations', async () => {
    mockFindUnique.mockResolvedValue({ memberships: [] })
    const page = await DashboardPage()
    render(page)

    expect(screen.getByText(/no organizations yet/i)).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /get started/i })
    ).toBeInTheDocument()
  })

  it('renders singular member label and renewal date', async () => {
    const periodEnd = new Date('2025-06-15T12:00:00Z')
    mockFindUnique.mockResolvedValue({
      name: 'Alex',
      memberships: [
        {
          role: 'MEMBER',
          organization: {
            id: 'org-1',
            name: 'Solo Org',
            members: [{ id: 'm1' }],
            subscription: {
              status: 'active',
              currentPeriodEnd: periodEnd,
              plan: { name: 'Starter' },
            },
          },
        },
      ],
    })

    const page = await DashboardPage()
    render(page)

    expect(screen.getByText(/1 member/i)).toBeInTheDocument()
    expect(screen.getByText(/renews/i)).toBeInTheDocument()
  })

  it('renders organizations with active subscription', async () => {
    const periodEnd = new Date()
    mockFindUnique.mockResolvedValue({
      name: 'John Doe',
      memberships: [
        {
          role: 'ADMIN',
          organization: {
            id: 'org-1',
            name: 'Acme',
            members: [{ id: 'm1' }, { id: 'm2' }],
            subscription: {
              status: 'active',
              currentPeriodEnd: periodEnd,
              plan: { name: 'Pro' },
            },
          },
        },
      ],
    })

    const page = await DashboardPage()
    render(page)

    expect(screen.getByText(/welcome back, john/i)).toBeInTheDocument()
    expect(screen.getByText('Acme')).toBeInTheDocument()
    expect(screen.getByText('Pro')).toBeInTheDocument()
    expect(screen.getByText(/2 members/i)).toBeInTheDocument()
  })

  it('renders active badge fallback when plan name is missing', async () => {
    mockFindUnique.mockResolvedValue({
      name: 'Alex',
      memberships: [
        {
          role: 'ADMIN',
          organization: {
            id: 'org-1',
            name: 'Acme',
            members: [{ id: 'm1' }],
            subscription: {
              status: 'active',
              currentPeriodEnd: new Date(),
              plan: null,
            },
          },
        },
      ],
    })

    const page = await DashboardPage()
    render(page)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders free plan for inactive subscription', async () => {
    mockFindUnique.mockResolvedValue({
      name: null,
      memberships: [
        {
          role: 'MEMBER',
          organization: {
            id: 'org-1',
            name: 'Solo',
            members: [{ id: 'm1' }],
            subscription: null,
          },
        },
      ],
    })

    const page = await DashboardPage()
    render(page)

    expect(screen.getByText(/welcome back, there/i)).toBeInTheDocument()
    expect(screen.getByText('Free')).toBeInTheDocument()
    expect(screen.getByText(/1 member/i)).toBeInTheDocument()
  })

  it('exports metadata', () => {
    expect(metadata.title).toBe('Dashboard')
  })
})
