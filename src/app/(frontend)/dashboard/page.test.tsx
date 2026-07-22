import { render, screen } from '@testing-library/react'
import { mockUser } from '@/test-utils'

const mockRequireAuth = jest.fn()
const mockGetDbUserWithMemberships = jest.fn()

jest.mock('@/lib/auth', () => ({
  requireAuth: () => mockRequireAuth(),
  getDbUserWithMemberships: () => mockGetDbUserWithMemberships(),
}))

import DashboardPage, { metadata } from './page'

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRequireAuth.mockResolvedValue(mockUser)
  })

  it('renders greeting when user record is missing', async () => {
    mockGetDbUserWithMemberships.mockResolvedValue(null)
    const page = await DashboardPage()
    render(page)
    expect(
      screen.getByText(/good (morning|afternoon|evening), there/i)
    ).toBeInTheDocument()
  })

  it('renders empty state when no organizations', async () => {
    mockGetDbUserWithMemberships.mockResolvedValue({ memberships: [] })
    const page = await DashboardPage()
    render(page)

    expect(screen.getByText(/no organizations yet/i)).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /create organization/i })
    ).toBeInTheDocument()
  })

  it('renders singular member label and renewal date', async () => {
    const periodEnd = new Date('2025-06-15T12:00:00Z')
    mockGetDbUserWithMemberships.mockResolvedValue({
      name: 'Alex',
      memberships: [
        {
          role: 'MEMBER',
          organization: {
            id: 'org-1',
            name: 'Solo Org',
            members: [{ id: 'm1' }],
            subscription: {
              status: 'ACTIVE',
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
    mockGetDbUserWithMemberships.mockResolvedValue({
      name: 'John Doe',
      memberships: [
        {
          role: 'ADMIN',
          organization: {
            id: 'org-1',
            name: 'Acme',
            members: [{ id: 'm1' }, { id: 'm2' }],
            subscription: {
              status: 'ACTIVE',
              currentPeriodEnd: periodEnd,
              plan: { name: 'Pro' },
            },
          },
        },
      ],
    })

    const page = await DashboardPage()
    render(page)

    expect(
      screen.getByText(/good (morning|afternoon|evening), john/i)
    ).toBeInTheDocument()
    expect(screen.getAllByText('Acme').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Pro').length).toBeGreaterThan(0)
    expect(screen.getByText(/2 members/i)).toBeInTheDocument()
  })

  it('renders active badge fallback when plan name is missing', async () => {
    mockGetDbUserWithMemberships.mockResolvedValue({
      name: 'Alex',
      memberships: [
        {
          role: 'ADMIN',
          organization: {
            id: 'org-1',
            name: 'Acme',
            members: [{ id: 'm1' }],
            subscription: {
              status: 'ACTIVE',
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
    mockGetDbUserWithMemberships.mockResolvedValue({
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

    expect(
      screen.getByText(/good (morning|afternoon|evening), there/i)
    ).toBeInTheDocument()
    expect(screen.getByText('Free')).toBeInTheDocument()
    expect(screen.getByText(/1 member/i)).toBeInTheDocument()
  })

  it('exports metadata', () => {
    expect(metadata.title).toBe('Dashboard')
  })
})
