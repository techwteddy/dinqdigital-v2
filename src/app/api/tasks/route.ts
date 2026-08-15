import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { TED_ADMIN_EMAIL } from '@/lib/admin'
import { getDbUserWithMemberships, requireAuthApi } from '@/lib/auth'
import { AuthError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'

const createTaskSchema = z.object({
  orgId: z.string().min(1),
  projectId: z.string().min(1).optional().nullable(),
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional().nullable(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  assignedTo: z.string().optional().nullable(),
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
        return NextResponse.json({ tasks: [] })
      }
      if (orgId && orgId !== membershipOrgId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const tasks = await prisma.task.findMany({
      where: {
        ...(ted
          ? orgId
            ? { orgId }
            : {}
          : { orgId: orgId ?? dbUser!.memberships[0]!.organization.id }),
        ...(status && status !== 'all' ? { status } : {}),
      },
      orderBy: [{ status: 'asc' }, { dueDate: 'asc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json({ tasks })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    logger.error('List tasks failed', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return NextResponse.json({ error: 'Failed to list tasks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthApi()
    if (!isTed(user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const input = createTaskSchema.parse(body)

    const task = await prisma.task.create({
      data: {
        orgId: input.orgId,
        projectId: input.projectId ?? null,
        title: input.title,
        description: input.description ?? null,
        status: input.status ?? 'todo',
        priority: input.priority ?? 'medium',
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        assignedTo: input.assignedTo ?? null,
      },
    })

    const members = await prisma.organizationMember.findMany({
      where: { organizationId: input.orgId },
      select: { userId: true },
    })

    if (members.length > 0) {
      await prisma.notification.createMany({
        data: members.map((member) => ({
          userId: member.userId,
          orgId: input.orgId,
          title: 'New task assigned',
          body: `Ted assigned you a new task: ${task.title}`,
          type: 'info',
        })),
      })
    }

    return NextResponse.json({ task }, { status: 201 })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    logger.error('Create task failed', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
