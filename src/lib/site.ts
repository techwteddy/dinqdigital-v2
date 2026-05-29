/**
 * Site-wide branding — customize via environment variables for your product.
 */

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'LaunchKit'
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? 'https://launchkit.dev'
export const APP_TAGLINE =
  process.env.NEXT_PUBLIC_APP_TAGLINE ??
  'The smarter way to run, grow, and scale your business.'
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ??
  `${APP_NAME} helps modern teams automate workflows, understand performance in real time, and collaborate without friction — so you can focus on what matters.`

export const PRODUCT_CATEGORY =
  process.env.NEXT_PUBLIC_PRODUCT_CATEGORY ?? 'Business operations platform'

export const DEMO_DASHBOARD_PATH = '/demo'

export const GITHUB_REPO =
  process.env.NEXT_PUBLIC_GITHUB_REPO ??
  'https://github.com/OmarSharaf/launchkit'
export const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL ?? `${APP_URL}/demo`
export const DEMO_URL =
  process.env.NEXT_PUBLIC_DEMO_URL ?? `${APP_URL}${DEMO_DASHBOARD_PATH}`

export const SHOW_DEVELOPER_CREDIT =
  process.env.NEXT_PUBLIC_SHOW_DEVELOPER_CREDIT !== 'false'

export const DEVELOPER_NAME = 'Omar S. M. Abdelfatah'
export const DEVELOPER_URL = 'https://www.omarsharaf.me'
export const DEVELOPER_GITHUB = 'https://github.com/OmarSharaf'
export const DEVELOPER_LINKEDIN = 'https://www.linkedin.com/in/omarsharafaldin/'

export const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@launchkit.dev'
