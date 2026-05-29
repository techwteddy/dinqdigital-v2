import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

interface AuditLogInput {
  action: string
  entity: string
  entityId?: string
  metadata?: Record<string, unknown>
  userId?: string
  organizationId?: string
  ipAddress?: string
  userAgent?: string
}

export async function createAuditLog(input: AuditLogInput) {
  return prisma.auditLog.create({
    data: {
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      metadata: (input.metadata ?? undefined) as
        | Prisma.InputJsonValue
        | undefined,
      userId: input.userId,
      organizationId: input.organizationId,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    },
  })
}
