import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { TED_ADMIN_EMAIL } from '@/lib/admin'
import { requireAuthApi } from '@/lib/auth'
import { AuthError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'
import { supportStatusLabel } from '@/lib/support'

const updateTicketSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(5000).optional(),
  status: z.enum(['open', 'in_progress', 'resolved']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  category: z
    .enum(['general', 'bug', 'feature', 'billing', 'design', 'content'])
    .optional(),
})

type RouteContext = {
  params: Promise<{ id: string }>
}

function isTed(email?: string | null) {
  return email === TED_ADMIN_EMAIL
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuthApi()
    if (!isTed(user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await context.params
    const body = await request.json()
    const input = updateTicketSchema.parse(body)

    const existing = await prisma.supportTicket.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const ticket = await prisma.supportTicket.update({
      where: { id },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.description !== undefined
          ? { description: input.description }
          : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.priority !== undefined ? { priority: input.priority } : {}),
        ...(input.category !== undefined ? { category: input.category } : {}),
      },
    })

    if (input.status !== undefined && input.status !== existing.status) {
      const clientUser = await prisma.user.findUnique({
        where: { email: existing.clientEmail },
        select: { id: true },
      })

      if (clientUser) {
        await prisma.notification.create({
          data: {
            userId: clientUser.id,
            orgId: ticket.orgId,
            title: 'Support ticket updated',
            body: `Your ticket '${ticket.title}' is now ${supportStatusLabel(ticket.status)}`,
            type: 'info',
          },
        })
      }
    }

    return NextResponse.json({ ticket })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    logger.error('Update support ticket failed', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return NextResponse.json(
      { error: 'Failed to update support ticket' },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuthApi()
    if (!isTed(user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await context.params
    const existing = await prisma.supportTicket.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.supportTicket.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    logger.error('Delete support ticket failed', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return NextResponse.json(
      { error: 'Failed to delete support ticket' },
      { status: 500 }
    )
  }
}
