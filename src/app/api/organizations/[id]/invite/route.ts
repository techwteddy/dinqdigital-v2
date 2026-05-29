import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuthApi, requireOrgAdmin } from '@/lib/auth'
import { inviteMemberSchema } from '@/lib/validations'
import { sendInvitationEmail } from '@/lib/email'
import { APP_URL } from '@/lib/site'
import { AuthError } from '@/lib/errors'
import { createAuditLog } from '@/lib/audit'
import { logger } from '@/lib/logger'

const paramsSchema = z.object({ id: z.string().min(1) })

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuthApi()
    const { id: organizationId } = paramsSchema.parse(await context.params)
    const body = await request.json()
    const input = inviteMemberSchema.parse(body)

    const membership = await requireOrgAdmin(organizationId, user.id)
    if (!membership) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      )
    }

    const existingMember = await prisma.organizationMember.findFirst({
      where: {
        organizationId,
        user: { email: input.email },
      },
    })

    if (existingMember) {
      return NextResponse.json(
        { error: 'User is already a member of this organization' },
        { status: 409 }
      )
    }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const invitation = await prisma.invitation.create({
      data: {
        email: input.email.toLowerCase(),
        role: input.role,
        organizationId,
        invitedById: user.id,
        expiresAt,
      },
    })

    const inviteUrl = `${APP_URL}/auth/invite?token=${invitation.token}`

    await sendInvitationEmail({
      to: invitation.email,
      organizationName: membership.organization.name,
      inviteUrl,
      inviterName: (await prisma.user.findUnique({ where: { id: user.id } }))
        ?.name,
    })

    await createAuditLog({
      action: 'invitation.created',
      entity: 'invitation',
      entityId: invitation.id,
      userId: user.id,
      organizationId,
      metadata: { email: invitation.email, role: invitation.role },
    })

    return NextResponse.json({ invitation, inviteUrl }, { status: 201 })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    logger.error('Invite member failed', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return NextResponse.json(
      { error: 'Failed to send invitation' },
      { status: 500 }
    )
  }
}
