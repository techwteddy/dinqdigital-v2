import { getSafeRedirectPath } from './safe-redirect'

describe('getSafeRedirectPath', () => {
  it('returns fallback for empty input', () => {
    expect(getSafeRedirectPath(null)).toBe('/dashboard')
  })

  it('allows relative paths', () => {
    expect(getSafeRedirectPath('/dashboard/settings')).toBe(
      '/dashboard/settings'
    )
  })

  it('blocks protocol-relative URLs', () => {
    expect(getSafeRedirectPath('//evil.com')).toBe('/dashboard')
  })

  it('blocks absolute URLs', () => {
    expect(getSafeRedirectPath('https://evil.com')).toBe('/dashboard')
  })
})
