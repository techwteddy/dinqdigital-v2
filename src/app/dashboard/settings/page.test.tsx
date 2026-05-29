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

import SettingsPage, { metadata } from './page'

describe('SettingsPage', () => {
  beforeEach(() => {
    mockRequireAuth.mockResolvedValue(mockUser)
  })

  it('renders profile fields', async () => {
    mockFindUnique.mockResolvedValue({
      name: 'Jane Doe',
      memberships: [],
    })

    render(await SettingsPage())
    expect(screen.getByRole('heading', { name: /settings/i })).toBeInTheDocument()
    expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText(/not part of any organization/i)).toBeInTheDocument()
  })

  it('handles missing profile and email values', async () => {
    mockRequireAuth.mockResolvedValue({ ...mockUser, email: null })
    mockFindUnique.mockResolvedValue({ name: null, memberships: [] })

    render(await SettingsPage())
    expect(screen.getByLabelText(/full name/i)).toHaveValue('')
    expect(screen.getByLabelText(/email/i)).toHaveValue('')
  })

  it('lists organizations with singular member label', async () => {
    mockFindUnique.mockResolvedValue({
      name: 'Jane',
      memberships: [
        {
          role: 'MEMBER',
          organization: {
            id: 'org-1',
            name: 'Solo',
            members: [{ id: '1' }],
          },
        },
      ],
    })

    render(await SettingsPage())
    expect(screen.getByText(/1 member/i)).toBeInTheDocument()
  })

  it('lists organizations with member counts', async () => {
    mockFindUnique.mockResolvedValue({
      name: 'Jane',
      memberships: [
        {
          role: 'ADMIN',
          organization: {
            id: 'org-1',
            name: 'Acme',
            members: [{ id: '1' }, { id: '2' }],
          },
        },
      ],
    })

    render(await SettingsPage())
    expect(screen.getByText('Acme')).toBeInTheDocument()
    expect(screen.getByText(/2 members/i)).toBeInTheDocument()
    expect(screen.getByText('admin')).toBeInTheDocument()
  })

  it('exports metadata', () => {
    expect(metadata.title).toBe('Settings')
  })
})
