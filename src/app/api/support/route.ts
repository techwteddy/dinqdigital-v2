import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { TED_ADMIN_EMAIL } from '@/lib/admin'
import { getDbUserWithMemberships, requireAuthApi } from '@/lib/auth'
import { AuthError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'

const createTicketSchema = z.object({
  orgId: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  category: z
    .enum(['bug', 'website_down', 'performance', 'billing', 'general_help'])
    .optional(),
})

function isTed(email?: string | null) {
  return email === TED_ADMIN_EMAIL
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthApi()
    const dbUser = await getDbUserWithMemberships()
    const orgId = request.nextUrl.searchParams.get('orgId')
    const status = request.nextUrl.searchParams.get('status')
    const ted = isTed(user.email)

    if (!ted) {
      const membershipOrgId = dbUser?.memberships[0]?.organization.id
      if (!membershipOrgId) {
        return NextResponse.json({ tickets: [] })
      }
      if (orgId && orgId !== membershipOrgId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const tickets = await prisma.supportTicket.findMany({
      where: {
        ...(ted
          ? orgId
            ? { orgId }
            : {}
          : { orgId: orgId ?? dbUser!.memberships[0]!.organization.id }),
        ...(status && status !== 'all' ? { status } : {}),
      },
      orderBy: [{ createdAt: 'desc' }],
    })

    return NextResponse.json({ tickets })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    logger.error('List support tickets failed', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return NextResponse.json(
      { error: 'Failed to list support tickets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthApi()
    const dbUser = await getDbUserWithMemberships()
    const body = await request.json()
    const input = createTicketSchema.parse(body)

    const membershipOrgId = dbUser?.memberships[0]?.organization.id
    const ted = isTed(user.email)

    if (!ted) {
      if (!membershipOrgId || input.orgId !== membershipOrgId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const clientEmail = user.email?.trim() || 'unknown@client'
    const ticket = await prisma.supportTicket.create({
      data: {
        orgId: input.orgId,
        clientEmail,
        title: input.title,
        description: input.description,
        priority: input.priority ?? 'medium',
        category: input.category ?? 'general_help',
      },
    })

    const tedUser = await prisma.user.findUnique({
      where: { email: TED_ADMIN_EMAIL },
      select: { id: true },
    })

    if (tedUser) {
      await prisma.notification.create({
        data: {
          userId: tedUser.id,
          orgId: input.orgId,
          title: 'New support ticket',
          body: `${clientEmail}: ${ticket.title}`,
          type: 'info',
        },
      })
    }

    return NextResponse.json({ ticket }, { status: 201 })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    logger.error('Create support ticket failed', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return NextResponse.json(
      { error: 'Failed to create support ticket' },
      { status: 500 }
    )
  }
}
