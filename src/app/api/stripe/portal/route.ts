import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createBillingPortalSession } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { requireAuthApi } from '@/lib/auth'
import { AuthError } from '@/lib/errors'
import { logger } from '@/lib/logger'

const schema = z.object({
  organizationId: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthApi()
    const body = await request.json()
    const { organizationId } = schema.parse(body)

    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId: user.id,
        organizationId,
        role: { in: ['ADMIN', 'SUPER_ADMIN'] },
      },
      include: { organization: true },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      )
    }

    if (!membership.organization.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No billing account found. Subscribe to a plan first.' },
        { status: 400 }
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL!
    const session = await createBillingPortalSession({
      customerId: membership.organization.stripeCustomerId,
      returnUrl: `${appUrl}/dashboard/billing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    logger.error('Billing portal error', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return NextResponse.json(
      { error: 'Failed to create billing portal session' },
      { status: 500 }
    )
  }
}
