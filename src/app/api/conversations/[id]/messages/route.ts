import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { TED_ADMIN_EMAIL } from '@/lib/admin'
import { getDbUserWithMemberships, requireAuthApi } from '@/lib/auth'
import { AuthError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'

const createMessageSchema = z.object({
  body: z.string().min(1).max(5000),
})

type RouteContext = {
  params: Promise<{ id: string }>
}

function isTed(email?: string | null) {
  return email === TED_ADMIN_EMAIL
}

async function canAccessConversation(
  conversationId: string,
  userEmail: string | undefined,
  orgId: string | undefined
) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  })
  if (!conversation) return null

  if (isTed(userEmail)) return conversation
  if (orgId && conversation.orgId === orgId) return conversation
  return false
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuthApi()
    const dbUser = await getDbUserWithMemberships()
    const { id } = await context.params
    const orgId = dbUser?.memberships[0]?.organization.id

    const access = await canAccessConversation(id, user.email, orgId)
    if (access === null) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    if (access === false) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: 'asc' },
    })

    // Mark messages from the other party as read when viewing the thread.
    await prisma.message.updateMany({
      where: {
        conversationId: id,
        isRead: false,
        NOT: { senderEmail: user.email ?? '' },
      },
      data: { isRead: true },
    })

    return NextResponse.json({
      conversation: access,
      messages: messages.map((message) => ({
        ...message,
        isRead:
          message.senderEmail === user.email
            ? message.isRead
            : true,
      })),
    })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    logger.error('List messages failed', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return NextResponse.json(
      { error: 'Failed to list messages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuthApi()
    const dbUser = await getDbUserWithMemberships()
    const { id } = await context.params
    const orgId = dbUser?.memberships[0]?.organization.id

    const access = await canAccessConversation(id, user.email, orgId)
    if (access === null) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    if (access === false) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const input = createMessageSchema.parse(body)

    const ted = isTed(user.email)
    const senderName = ted
      ? 'Ted'
      : ((typeof user.user_metadata?.full_name === 'string'
          ? user.user_metadata.full_name
          : null) ??
        dbUser?.name ??
        user.email?.split('@')[0] ??
        'Client')

    const message = await prisma.message.create({
      data: {
        conversationId: id,
        senderEmail: user.email ?? (ted ? TED_ADMIN_EMAIL : ''),
        senderName,
        body: input.body,
        isRead: false,
      },
    })

    await prisma.conversation.update({
      where: { id },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json({ message }, { status: 201 })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    logger.error('Create message failed', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
