import { type NextRequest, NextResponse } from 'next/server'
import { requireAuthApi } from '@/lib/auth'
import { createOrganizationSchema } from '@/lib/validations'
import { createOrganization } from '@/lib/organizations'
import { AuthError } from '@/lib/errors'
import { z } from 'zod'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthApi()
    const body = await request.json()
    const input = createOrganizationSchema.parse(body)

    const organization = await createOrganization({
      userId: user.id,
      name: input.name,
      slug: input.slug,
    })

    return NextResponse.json({ organization }, { status: 201 })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    logger.error('Create organization failed', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return NextResponse.json(
      { error: 'Failed to create organization' },
      { status: 500 }
    )
  }
}
