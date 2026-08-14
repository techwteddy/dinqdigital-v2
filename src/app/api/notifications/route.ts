import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuthApi } from '@/lib/auth'
import { AuthError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'

const createNotificationSchema = z.object({
  userId: z.string().min(1).optional(),
  orgId: z.string().min(1).optional().nullable(),
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(2000),
  type: z.string().min(1).max(50).optional(),
})

export async function GET() {
  try {
    const user = await requireAuthApi()

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    const unreadCount = await prisma.notification.count({
      where: { userId: user.id, isRead: false },
    })

    return NextResponse.json({ notifications, unreadCount })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    logger.error('List notifications failed', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return NextResponse.json(
      { error: 'Failed to list notifications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthApi()
    const body = await request.json()
    const input = createNotificationSchema.parse(body)

    const notification = await prisma.notification.create({
      data: {
        userId: input.userId ?? user.id,
        orgId: input.orgId ?? null,
        title: input.title,
        body: input.body,
        type: input.type ?? 'info',
      },
    })

    return NextResponse.json({ notification }, { status: 201 })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    logger.error('Create notification failed', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}
