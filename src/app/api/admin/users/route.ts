import { NextResponse } from 'next/server'
import { TED_ADMIN_EMAIL } from '@/lib/admin'
import { listPortalUsers } from '@/lib/admin-users'
import { requireAuthApi } from '@/lib/auth'
import { AuthError } from '@/lib/errors'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    const user = await requireAuthApi()
    if (user.email !== TED_ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const users = await listPortalUsers()
    return NextResponse.json({ users })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    logger.error('List portal users failed', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return NextResponse.json({ error: 'Failed to list users' }, { status: 500 })
  }
}
