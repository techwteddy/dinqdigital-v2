import {
  cn,
  formatRelativeDate,
  generateRandomString,
  getInitials,
  isSubscriptionActive,
  slugify,
  sleep,
  stringToColor,
  truncate,
} from './utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('px-2', 'py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
  })
})

describe('slugify', () => {
  it('converts strings to url-safe slugs', () => {
    expect(slugify('Hello World!')).toBe('hello-world')
    expect(slugify('  Foo__Bar--  ')).toBe('foo-bar')
    expect(slugify('---test---')).toBe('test')
  })
})

describe('formatRelativeDate', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2025-05-29T12:00:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('returns "just now" for recent dates', () => {
    const date = new Date('2025-05-29T11:59:30Z')
    expect(formatRelativeDate(date)).toBe('just now')
  })

  it('returns minutes ago', () => {
    const date = new Date('2025-05-29T11:30:00Z')
    expect(formatRelativeDate(date)).toBe('30m ago')
  })

  it('returns hours ago', () => {
    const date = new Date('2025-05-29T09:00:00Z')
    expect(formatRelativeDate(date)).toBe('3h ago')
  })

  it('returns days ago', () => {
    const date = new Date('2025-05-27T12:00:00Z')
    expect(formatRelativeDate(date)).toBe('2d ago')
  })

  it('returns formatted date for older dates', () => {
    const date = new Date('2025-01-15T12:00:00Z')
    expect(formatRelativeDate(date)).toMatch(/Jan/)
  })

  it('includes year for dates over 365 days ago', () => {
    const date = new Date('2020-01-15T12:00:00Z')
    const result = formatRelativeDate(date)
    expect(result).toMatch(/2020/)
  })

  it('accepts string dates', () => {
    expect(formatRelativeDate('2025-05-29T11:59:30Z')).toBe('just now')
  })
})

describe('getInitials', () => {
  it('returns up to two initials', () => {
    expect(getInitials('John Doe')).toBe('JD')
    expect(getInitials('Alice')).toBe('A')
    expect(getInitials('A B C D')).toBe('AB')
  })
})

describe('isSubscriptionActive', () => {
  it('returns true for active and trialing statuses', () => {
    expect(isSubscriptionActive('active')).toBe(true)
    expect(isSubscriptionActive('TRIALING')).toBe(true)
  })

  it('returns false for inactive statuses', () => {
    expect(isSubscriptionActive('canceled')).toBe(false)
    expect(isSubscriptionActive('past_due')).toBe(false)
  })
})

describe('truncate', () => {
  it('returns original string when within limit', () => {
    expect(truncate('hello', 10)).toBe('hello')
  })

  it('truncates with ellipsis', () => {
    expect(truncate('hello world', 8)).toBe('hello...')
  })
})

describe('stringToColor', () => {
  it('returns a consistent color class for the same string', () => {
    const color1 = stringToColor('test')
    const color2 = stringToColor('test')
    expect(color1).toBe(color2)
    expect(color1).toMatch(/^bg-/)
  })

  it('can return different colors for different strings', () => {
    const colors = new Set(
      Array.from({ length: 20 }, (_, i) => stringToColor(`user-${i}`))
    )
    expect(colors.size).toBeGreaterThan(1)
  })
})

describe('sleep', () => {
  it('resolves after the specified delay', async () => {
    jest.useFakeTimers()
    const promise = sleep(1000)
    jest.advanceTimersByTime(1000)
    await expect(promise).resolves.toBeUndefined()
    jest.useRealTimers()
  })
})

describe('generateRandomString', () => {
  it('generates string of default length', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5)
    expect(generateRandomString()).toHaveLength(16)
    Math.random.mockRestore()
  })

  it('generates string of custom length', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0)
    expect(generateRandomString(8)).toHaveLength(8)
    Math.random.mockRestore()
  })
})
