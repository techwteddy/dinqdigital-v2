import { createBrowserClient } from '@supabase/ssr'

/**
 * Browser Supabase client — cookie storage via @supabase/ssr
 * (not localStorage), so PKCE verifiers survive SSR redirects
 * in the same browser.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        path: '/',
        sameSite: 'lax',
      },
    }
  )
}
