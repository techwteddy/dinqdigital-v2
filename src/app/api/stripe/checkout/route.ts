import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createCheckoutSession, getOrCreateStripeCustomer } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { requireAuthApi } from '@/lib/auth'
import { AuthError } from '@/lib/errors'
import { logger } from '@/lib/logger'

const schema = z.object({
  priceId: z.string().min(1),
  organizationId: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthApi()
    const body = await request.json()
    const { priceId, organizationId } = schema.parse(body)

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

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    const customer = await getOrCreateStripeCustomer({
      organizationId,
      organizationName: membership.organization.name,
      email: dbUser?.email ?? user.email!,
      existingCustomerId: membership.organization.stripeCustomerId,
    })

    if (!membership.organization.stripeCustomerId) {
      await prisma.organization.update({
        where: { id: organizationId },
        data: { stripeCustomerId: customer.id },
      })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL!
    const session = await createCheckoutSession({
      priceId,
      customerId: customer.id,
      organizationId,
      successUrl: `${appUrl}/dashboard/billing?success=true`,
      cancelUrl: `${appUrl}/dashboard/billing?canceled=true`,
      trialDays: 14,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    logger.error('Checkout session error', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
