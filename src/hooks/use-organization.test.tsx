import { renderHook, waitFor } from '@testing-library/react'
import { useOrganization } from './use-organization'

describe('useOrganization', () => {
  const mockOrg = {
    id: 'org-123',
    name: 'Test Org',
    subscription: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  it('does not fetch when organizationId is undefined', async () => {
    const { result } = renderHook(() => useOrganization())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(global.fetch).not.toHaveBeenCalled()
    expect(result.current.organization).toBeNull()
  })

  it('fetches organization when id is provided', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockOrg,
    })

    const { result } = renderHook(() => useOrganization('org-123'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.organization).toEqual(mockOrg)
    expect(global.fetch).toHaveBeenCalledWith('/api/organizations/org-123')
  })

  it('sets error on failed fetch', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: false })

    const { result } = renderHook(() => useOrganization('org-123'))

    await waitFor(() => {
      expect(result.current.error).not.toBeNull()
    })

    expect(result.current.error?.message).toBe('Failed to fetch organization')
  })

  it('handles non-Error throws', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue('string error')

    const { result } = renderHook(() => useOrganization('org-123'))

    await waitFor(() => {
      expect(result.current.error?.message).toBe('Unknown error')
    })
  })

  it('refetches organization', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockOrg,
    })

    const { result } = renderHook(() => useOrganization('org-123'))

    await waitFor(() => {
      expect(result.current.organization).toEqual(mockOrg)
    })

    await result.current.refetch()

    expect(global.fetch).toHaveBeenCalledTimes(2)
  })
})
