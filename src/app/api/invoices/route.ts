import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { TED_ADMIN_EMAIL } from '@/lib/admin'
import { getDbUserWithMemberships, requireAuthApi } from '@/lib/auth'
import { AuthError } from '@/lib/errors'
import { formatInvoiceAmount } from '@/lib/invoices'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'

const createInvoiceSchema = z.object({
  orgId: z.string().min(1),
  clientEmail: z.string().email(),
  title: z.string().min(1).max(200),
  amount: z.number().positive(),
  type: z.enum(['stripe', 'custom']).optional(),
  stripeId: z.string().min(1).optional().nullable(),
  notes: z.string().max(5000).optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  status: z.enum(['pending', 'paid', 'overdue']).optional(),
})

function isTed(email?: string | null) {
  return email === TED_ADMIN_EMAIL
}

async function notifyClient(params: {
  clientEmail: string
  orgId: string
  title: string
  body: string
}) {
  const clientUser = await prisma.user.findUnique({
    where: { email: params.clientEmail },
    select: { id: true },
  })

  if (clientUser) {
    await prisma.notification.create({
      data: {
        userId: clientUser.id,
        orgId: params.orgId,
        title: params.title,
        body: params.body,
        type: 'info',
      },
    })
    return
  }

  const members = await prisma.organizationMember.findMany({
    where: { organizationId: params.orgId },
    select: { userId: true },
  })

  if (members.length === 0) return

  await prisma.notification.createMany({
    data: members.map((member) => ({
      userId: member.userId,
      orgId: params.orgId,
      title: params.title,
      body: params.body,
      type: 'info',
    })),
  })
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
        return NextResponse.json({ invoices: [] })
      }
      if (orgId && orgId !== membershipOrgId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const invoices = await prisma.invoice.findMany({
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

    return NextResponse.json({ invoices })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    logger.error('List invoices failed', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return NextResponse.json(
      { error: 'Failed to list invoices' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthApi()
    if (!isTed(user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const input = createInvoiceSchema.parse(body)

    const invoice = await prisma.invoice.create({
      data: {
        orgId: input.orgId,
        clientEmail: input.clientEmail,
        title: input.title,
        amount: input.amount,
        type: input.type ?? 'stripe',
        stripeId: input.stripeId ?? null,
        notes: input.notes ?? null,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        status: input.status ?? 'pending',
      },
    })

    await notifyClient({
      clientEmail: invoice.clientEmail,
      orgId: invoice.orgId,
      title: 'New invoice',
      body: `You have a new invoice: ${invoice.title} for ${formatInvoiceAmount(invoice.amount)}`,
    })

    return NextResponse.json({ invoice }, { status: 201 })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    logger.error('Create invoice failed', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    )
  }
}
