import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { TED_ADMIN_EMAIL } from '@/lib/admin'
import { requireAuthApi } from '@/lib/auth'
import { AuthError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'

const updateInvoiceSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  amount: z.number().positive().optional(),
  status: z.enum(['pending', 'paid', 'overdue']).optional(),
  type: z.enum(['stripe', 'custom']).optional(),
  stripeId: z.string().min(1).optional().nullable(),
  notes: z.string().max(5000).optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  paidAt: z.string().datetime().optional().nullable(),
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
    const input = updateInvoiceSchema.parse(body)

    const existing = await prisma.invoice.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const markingPaid =
      input.status === 'paid' && existing.status !== 'paid'

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.amount !== undefined ? { amount: input.amount } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.type !== undefined ? { type: input.type } : {}),
        ...(input.stripeId !== undefined ? { stripeId: input.stripeId } : {}),
        ...(input.notes !== undefined ? { notes: input.notes } : {}),
        ...(input.dueDate !== undefined
          ? { dueDate: input.dueDate ? new Date(input.dueDate) : null }
          : {}),
        ...(markingPaid
          ? { paidAt: new Date() }
          : input.paidAt !== undefined
            ? { paidAt: input.paidAt ? new Date(input.paidAt) : null }
            : {}),
      },
    })

    if (markingPaid) {
      const clientUser = await prisma.user.findUnique({
        where: { email: existing.clientEmail },
        select: { id: true },
      })

      if (clientUser) {
        await prisma.notification.create({
          data: {
            userId: clientUser.id,
            orgId: invoice.orgId,
            title: 'Invoice marked as paid',
            body: `Your invoice '${invoice.title}' has been confirmed as paid. Thank you!`,
            type: 'info',
          },
        })
      } else {
        const members = await prisma.organizationMember.findMany({
          where: { organizationId: invoice.orgId },
          select: { userId: true },
        })
        if (members.length > 0) {
          await prisma.notification.createMany({
            data: members.map((member) => ({
              userId: member.userId,
              orgId: invoice.orgId,
              title: 'Invoice marked as paid',
              body: `Your invoice '${invoice.title}' has been confirmed as paid. Thank you!`,
              type: 'info',
            })),
          })
        }
      }
    }

    return NextResponse.json({ invoice })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    logger.error('Update invoice failed', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return NextResponse.json(
      { error: 'Failed to update invoice' },
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
    const existing = await prisma.invoice.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.invoice.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    logger.error('Delete invoice failed', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    )
  }
}
