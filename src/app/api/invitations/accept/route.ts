import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuthApi } from '@/lib/auth'
import { AuthError } from '@/lib/errors'
import { createAuditLog } from '@/lib/audit'
import { logger } from '@/lib/logger'

const schema = z.object({
  token: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthApi()
    const body = await request.json()
    const { token } = schema.parse(body)

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    if (!dbUser?.email) {
      return NextResponse.json(
        { error: 'User email required' },
        { status: 400 }
      )
    }

    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: { organization: true },
    })

    if (!invitation || invitation.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Invitation not found or already used' },
        { status: 404 }
      )
    }

    if (invitation.expiresAt < new Date()) {
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: 'EXPIRED' },
      })
      return NextResponse.json(
        { error: 'Invitation has expired' },
        { status: 410 }
      )
    }

    if (invitation.email.toLowerCase() !== dbUser.email.toLowerCase()) {
      return NextResponse.json(
        { error: 'This invitation was sent to a different email address' },
        { status: 403 }
      )
    }

    await prisma.$transaction([
      prisma.organizationMember.upsert({
        where: {
          userId_organizationId: {
            userId: user.id,
            organizationId: invitation.organizationId,
          },
        },
        create: {
          userId: user.id,
          organizationId: invitation.organizationId,
          role: invitation.role,
        },
        update: { role: invitation.role },
      }),
      prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: 'ACCEPTED' },
      }),
    ])

    await createAuditLog({
      action: 'invitation.accepted',
      entity: 'invitation',
      entityId: invitation.id,
      userId: user.id,
      organizationId: invitation.organizationId,
    })

    return NextResponse.json({
      organization: invitation.organization,
    })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    logger.error('Accept invitation failed', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return NextResponse.json(
      { error: 'Failed to accept invitation' },
      { status: 500 }
    )
  }
}
