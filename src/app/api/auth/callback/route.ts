import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

/**
 * Supabase Auth Callback Handler
 *
 * Handles OAuth and magic link callbacks.
 * After Supabase confirms the session, we sync the user to our Prisma database.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Handle auth errors from Supabase
  if (error) {
    console.error('Auth callback error:', error, errorDescription)
    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent(errorDescription ?? error)}`
    )
  }

  if (code) {
    const supabase = await createClient()
    const { data, error: sessionError } =
      await supabase.auth.exchangeCodeForSession(code)

    if (sessionError) {
      console.error('Code exchange error:', sessionError)
      return NextResponse.redirect(
        `${origin}/auth/login?error=${encodeURIComponent(sessionError.message)}`
      )
    }

    if (data.user) {
      // Sync user to database
      await prisma.user.upsert({
        where: { id: data.user.id },
        create: {
          id: data.user.id,
          email: data.user.email!,
          name:
            data.user.user_metadata?.full_name ??
            data.user.user_metadata?.name ??
            null,
          avatarUrl: data.user.user_metadata?.avatar_url ?? null,
          emailVerified: !!data.user.email_confirmed_at,
        },
        update: {
          email: data.user.email!,
          name:
            data.user.user_metadata?.full_name ??
            data.user.user_metadata?.name ??
            undefined,
          avatarUrl:
            data.user.user_metadata?.avatar_url ?? undefined,
          emailVerified: !!data.user.email_confirmed_at,
        },
      })
    }

    const forwardedHost = request.headers.get('x-forwarded-host')
    const isLocalEnv = process.env.NODE_ENV === 'development'

    if (isLocalEnv) {
      return NextResponse.redirect(`${origin}${next}`)
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`)
    } else {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=No+code+provided`)
}
