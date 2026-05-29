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

import BillingPage, { metadata } from './page'

describe('BillingPage', () => {
  beforeEach(() => {
    mockRequireAuth.mockResolvedValue(mockUser)
  })

  it('renders free plan when no organization', async () => {
    mockFindUnique.mockResolvedValue({ memberships: [] })
    render(await BillingPage())
    expect(screen.getByRole('heading', { name: /billing/i })).toBeInTheDocument()
    expect(screen.getByText('Free')).toBeInTheDocument()
    expect(screen.getByText(/no organization selected/i)).toBeInTheDocument()
  })

  it('renders active subscription with cancel notice', async () => {
    mockFindUnique.mockResolvedValue({
      memberships: [
        {
          organization: {
            name: 'Acme',
            subscription: {
              status: 'active',
              cancelAtPeriodEnd: true,
              plan: { name: 'Pro' },
            },
          },
        },
      ],
    })

    render(await BillingPage())
    expect(screen.getByText('Pro')).toBeInTheDocument()
    expect(screen.getByText(/cancels at period end/i)).toBeInTheDocument()
  })

  it('shows active badge when plan name is missing', async () => {
    mockFindUnique.mockResolvedValue({
      memberships: [
        {
          organization: {
            name: 'Acme',
            subscription: {
              status: 'active',
              cancelAtPeriodEnd: false,
              plan: null,
            },
          },
        },
      ],
    })

    render(await BillingPage())
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders upgrade prompt without subscription', async () => {
    mockFindUnique.mockResolvedValue({
      memberships: [{ organization: { name: 'Solo', subscription: null } }],
    })

    render(await BillingPage())
    expect(screen.getByText(/upgrade to unlock/i)).toBeInTheDocument()
  })

  it('exports metadata', () => {
    expect(metadata.title).toBe('Billing')
  })
})
