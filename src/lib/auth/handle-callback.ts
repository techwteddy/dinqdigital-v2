import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSafeRedirectPath } from '@/lib/safe-redirect'
import { ensureDefaultOrganization } from '@/lib/organizations'
import { upsertPrismaUser } from '@/lib/auth/sync-user'
import { logger } from '@/lib/logger'

async function syncAuthUser(user: {
  id: string
  email?: string | null
  email_confirmed_at?: string | null
  user_metadata?: Record<string, unknown>
}) {
  const dbUser = await upsertPrismaUser(user)
  await ensureDefaultOrganization(user.id, dbUser.name)
  return dbUser
}

async function resolveAuthUser(
  supabase: Awaited<ReturnType<typeof createClient>>,
  user: {
    id: string
    email?: string | null
    email_confirmed_at?: string | null
    user_metadata?: Record<string, unknown>
  } | null
) {
  if (user) return user
  const {
    data: { user: sessionUser },
  } = await supabase.auth.getUser()
  return sessionUser
}

function redirectAfterAuth(request: NextRequest, next: string) {
  const { origin } = new URL(request.url)
  const forwardedHost = request.headers.get('x-forwarded-host')
  const isLocalEnv = process.env.NODE_ENV === 'development'

  if (isLocalEnv) {
    return NextResponse.redirect(`${origin}${next}`)
  }
  if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${next}`)
  }
  return NextResponse.redirect(`${origin}${next}`)
}

function redirectWithError(request: NextRequest, message: string) {
  const { origin } = new URL(request.url)
  return NextResponse.redirect(
    `${origin}/auth/login?error=${encodeURIComponent(message)}`
  )
}

/**
 * Handles Supabase auth redirects for:
 * - OAuth / same-browser PKCE: ?code=...
 * - Email links on any device: ?token_hash=...&type=...
 *
 * Always upserts the authenticated user into Prisma before redirecting.
 */
export async function handleAuthCallback(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = getSafeRedirectPath(searchParams.get('next'))
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  if (error) {
    logger.error('Auth callback error', { error, errorDescription })
    return redirectWithError(request, errorDescription ?? error)
  }

  const supabase = await createClient()

  // Cross-device email confirmation / recovery (no PKCE verifier needed)
  if (tokenHash && type) {
    const { data, error: otpError } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    })

    if (otpError) {
      logger.error('OTP verification error', { message: otpError.message })
      return redirectWithError(request, otpError.message)
    }

    try {
      const authUser = await resolveAuthUser(supabase, data.user)
      if (!authUser) {
        return redirectWithError(
          request,
          'Authentication succeeded but no user was returned'
        )
      }
      await syncAuthUser(authUser)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to sync authenticated user'
      logger.error('Auth user sync error', { message })
      return redirectWithError(request, message)
    }

    return redirectAfterAuth(request, next)
  }

  // Same-browser PKCE / OAuth code exchange
  if (code) {
    const { data, error: sessionError } =
      await supabase.auth.exchangeCodeForSession(code)

    if (sessionError) {
      logger.error('Code exchange error', { message: sessionError.message })
      return redirectWithError(request, sessionError.message)
    }

    try {
      const authUser = await resolveAuthUser(supabase, data.user)
      if (!authUser) {
        return redirectWithError(
          request,
          'Authentication succeeded but no user was returned'
        )
      }
      await syncAuthUser(authUser)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to sync authenticated user'
      logger.error('Auth user sync error', { message })
      return redirectWithError(request, message)
    }

    return redirectAfterAuth(request, next)
  }

  return redirectWithError(request, 'No code provided')
}
