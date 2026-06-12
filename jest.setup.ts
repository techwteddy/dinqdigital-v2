import '@testing-library/jest-dom'
import { TextDecoder, TextEncoder } from 'util'

Object.assign(global, { TextDecoder, TextEncoder })

process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
process.env.STRIPE_SECRET_KEY = 'sk_test_mock'
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_mock'
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
process.env.NEXT_PUBLIC_APP_NAME = 'Dinq Digital'
process.env.NEXT_PUBLIC_APP_TAGLINE =
  'The smarter way to run, grow, and scale your business.'
process.env.NEXT_PUBLIC_APP_DESCRIPTION =
  'We build premium websites and intelligent AI systems for modern businesses worldwide.'
process.env.NEXT_PUBLIC_DOCS_URL = 'http://localhost:3000/demo'

jest.mock('geist/font/sans', () => ({
  GeistSans: { variable: '--font-geist-sans' },
}))

jest.mock('geist/font/mono', () => ({
  GeistMono: { variable: '--font-geist-mono' },
}))
