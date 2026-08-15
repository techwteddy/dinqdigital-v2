import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { TED_ADMIN_EMAIL } from '@/lib/admin'
import { getDbUserWithMemberships, requireAuthApi } from '@/lib/auth'
import { AuthError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'

const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional().nullable(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  assignedTo: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
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
    const dbUser = await getDbUserWithMemberships()
    const { id } = await context.params
    const body = await request.json()
    const input = updateTaskSchema.parse(body)
    const ted = isTed(user.email)

    const existing = await prisma.task.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const membershipOrgId = dbUser?.memberships[0]?.organization.id
    if (!ted) {
      if (!membershipOrgId || existing.orgId !== membershipOrgId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      // Clients can only mark tasks complete / reopen to todo.
      const allowedKeys = Object.keys(input)
      if (
        allowedKeys.length !== 1 ||
        input.status === undefined ||
        !['todo', 'done'].includes(input.status)
      ) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.description !== undefined
          ? { description: input.description }
          : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.priority !== undefined ? { priority: input.priority } : {}),
        ...(input.dueDate !== undefined
          ? { dueDate: input.dueDate ? new Date(input.dueDate) : null }
          : {}),
        ...(input.assignedTo !== undefined
          ? { assignedTo: input.assignedTo }
          : {}),
        ...(input.projectId !== undefined
          ? { projectId: input.projectId }
          : {}),
      },
    })

    return NextResponse.json({ task })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    logger.error('Update task failed', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return NextResponse.json(
      { error: 'Failed to update task' },
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
    const existing = await prisma.task.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.task.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    logger.error('Delete task failed', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}
