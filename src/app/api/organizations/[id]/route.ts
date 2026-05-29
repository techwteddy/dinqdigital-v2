import { type NextRequest, NextResponse } from 'next/server'
import { requireAuthApi } from '@/lib/auth'
import { AuthError } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuthApi()
    const { id } = await params

    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId: user.id,
        organizationId: id,
      },
      include: {
        organization: {
          include: {
            subscription: { include: { plan: true } },
          },
        },
      },
    })

    if (!membership) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(membership.organization)
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    logger.error('Fetch organization failed', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return NextResponse.json(
      { error: 'Failed to fetch organization' },
      { status: 500 }
    )
  }
}
