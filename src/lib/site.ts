function normalizeAppUrl(raw: string | undefined, fallback: string): string {
  const value = raw?.trim() || fallback
  if (/^https?:\/\//i.test(value)) return value.replace(/\/$/, '')
  return `https://${value.replace(/\/$/, '')}`
}

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'Dinq Digital'
export const APP_URL = normalizeAppUrl(
  process.env.NEXT_PUBLIC_APP_URL,
  'https://dinqdigital.com'
)
export const AUTH_CALLBACK_URL = `${APP_URL}/api/auth/callback`
export const APP_TAGLINE =
  process.env.NEXT_PUBLIC_APP_TAGLINE ??
  'The smarter way to run, grow, and scale your business.'
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ??
  'We build premium websites and intelligent AI systems for modern businesses worldwide.'

export const PRODUCT_CATEGORY =
  process.env.NEXT_PUBLIC_PRODUCT_CATEGORY ?? 'Web Agency · AI Systems'

export const DEMO_DASHBOARD_PATH = '/demo'

export const GITHUB_REPO =
  process.env.NEXT_PUBLIC_GITHUB_REPO ??
  'https://github.com/dinqdigital/dinqdigital-v2'
export const DOCS_URL =
  process.env.NEXT_PUBLIC_DOCS_URL ?? `${APP_URL}${DEMO_DASHBOARD_PATH}`
export const DEMO_URL =
  process.env.NEXT_PUBLIC_DEMO_URL ?? `${APP_URL}${DEMO_DASHBOARD_PATH}`

export const LINKEDIN_URL =
  process.env.NEXT_PUBLIC_LINKEDIN_URL ?? 'https://www.linkedin.com'
export const INSTAGRAM_URL =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? 'https://www.instagram.com'

export const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'techwithteddy@gmail.com'

export const EMAIL_FROM =
  process.env.EMAIL_FROM ?? `${APP_NAME} <noreply@dinqdigital.com>`
