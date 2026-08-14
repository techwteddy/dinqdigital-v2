import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { TED_ADMIN_EMAIL } from '@/lib/admin'
import { getDbUserWithMemberships, requireAuthApi } from '@/lib/auth'
import { AuthError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'

const createConversationSchema = z.object({
  orgId: z.string().min(1),
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(5000),
})

function isTed(email?: string | null) {
  return email === TED_ADMIN_EMAIL
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthApi()
    const dbUser = await getDbUserWithMemberships()
    const orgId = request.nextUrl.searchParams.get('orgId')
    const ted = isTed(user.email)

    if (!ted) {
      const membershipOrgId = dbUser?.memberships[0]?.organization.id
      if (!membershipOrgId) {
        return NextResponse.json({ conversations: [] })
      }
      if (orgId && orgId !== membershipOrgId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const conversations = await prisma.conversation.findMany({
      where: ted
        ? orgId
          ? { orgId }
          : undefined
        : { orgId: orgId ?? dbUser!.memberships[0]!.organization.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    const unreadCounts =
      conversations.length === 0
        ? []
        : await prisma.message.groupBy({
            by: ['conversationId'],
            where: {
              conversationId: { in: conversations.map((item) => item.id) },
              isRead: false,
              NOT: { senderEmail: user.email ?? '' },
            },
            _count: { _all: true },
          })

    const unreadByConversation = new Map(
      unreadCounts.map((row) => [row.conversationId, row._count._all])
    )

    return NextResponse.json({
      conversations: conversations.map((conversation) => ({
        id: conversation.id,
        orgId: conversation.orgId,
        clientEmail: conversation.clientEmail,
        subject: conversation.subject,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        lastMessage: conversation.messages[0] ?? null,
        unreadCount: unreadByConversation.get(conversation.id) ?? 0,
      })),
    })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    logger.error('List conversations failed', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return NextResponse.json(
      { error: 'Failed to list conversations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthApi()
    const dbUser = await getDbUserWithMemberships()
    const body = await request.json()
    const input = createConversationSchema.parse(body)

    const membershipOrgId = dbUser?.memberships[0]?.organization.id
    if (!isTed(user.email) && membershipOrgId !== input.orgId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const senderName =
      (typeof user.user_metadata?.full_name === 'string'
        ? user.user_metadata.full_name
        : null) ??
      dbUser?.name ??
      user.email?.split('@')[0] ??
      'Client'

    const conversation = await prisma.conversation.create({
      data: {
        orgId: input.orgId,
        clientEmail: user.email ?? '',
        subject: input.subject,
        messages: {
          create: {
            senderEmail: user.email ?? '',
            senderName,
            body: input.body,
            isRead: false,
          },
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    return NextResponse.json({ conversation }, { status: 201 })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    logger.error('Create conversation failed', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
}
