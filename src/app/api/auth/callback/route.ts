import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { getSafeRedirectPath } from '@/lib/safe-redirect'
import { ensureDefaultOrganization } from '@/lib/organizations'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = getSafeRedirectPath(searchParams.get('next'))
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  if (error) {
    logger.error('Auth callback error', { error, errorDescription })
    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent(errorDescription ?? error)}`
    )
  }

  if (code) {
    const supabase = await createClient()
    const { data, error: sessionError } =
      await supabase.auth.exchangeCodeForSession(code)

    if (sessionError) {
      logger.error('Code exchange error', { message: sessionError.message })
      return NextResponse.redirect(
        `${origin}/auth/login?error=${encodeURIComponent(sessionError.message)}`
      )
    }

    if (data.user) {
      const displayName =
        data.user.user_metadata?.full_name ??
        data.user.user_metadata?.name ??
        null

      await prisma.user.upsert({
        where: { id: data.user.id },
        create: {
          id: data.user.id,
          email: data.user.email!,
          name: displayName,
          avatarUrl: data.user.user_metadata?.avatar_url ?? null,
          emailVerified: !!data.user.email_confirmed_at,
        },
        update: {
          email: data.user.email!,
          name: displayName ?? undefined,
          avatarUrl: data.user.user_metadata?.avatar_url ?? undefined,
          emailVerified: !!data.user.email_confirmed_at,
        },
      })

      await ensureDefaultOrganization(data.user.id, displayName)
    }

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

  return NextResponse.redirect(`${origin}/auth/login?error=No+code+provided`)
}
