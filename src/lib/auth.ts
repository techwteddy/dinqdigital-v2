import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { AuthError } from '@/lib/errors'

/**
 * Auth helpers for Server Components and Server Actions.
 * cache() dedupes calls within a single request — handy when layout + page both need the user.
 */

export const getUser = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

export const getDbUser = cache(async () => {
  const user = await getUser()
  if (!user) return null

  return prisma.user.findUnique({
    where: { id: user.id },
  })
})

const membershipInclude = {
  memberships: {
    include: {
      organization: {
        include: {
          subscription: { include: { plan: true } },
          members: {
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
      },
    },
    orderBy: { joinedAt: 'asc' as const },
  },
} as const

export const getDbUserWithMemberships = cache(async () => {
  const user = await getUser()
  if (!user) return null

  return prisma.user.findUnique({
    where: { id: user.id },
    include: membershipInclude,
  })
})

export async function requireAuth() {
  const user = await getUser()
  if (!user) redirect('/auth/login')
  return user
}

export async function requireAuthApi() {
  const user = await getUser()
  if (!user) throw new AuthError()
  return user
}

export async function requireGuest() {
  const user = await getUser()
  if (user) redirect('/dashboard')
}

export async function getOrganizationMembership(slug: string) {
  const user = await getUser()
  if (!user) return null

  return prisma.organizationMember.findFirst({
    where: {
      userId: user.id,
      organization: { slug },
    },
    include: {
      organization: {
        include: {
          subscription: {
            include: { plan: true },
          },
        },
      },
    },
  })
}

export async function requireOrgAdmin(organizationId: string, userId: string) {
  return prisma.organizationMember.findFirst({
    where: {
      userId,
      organizationId,
      role: { in: ['ADMIN', 'SUPER_ADMIN'] },
    },
    include: { organization: true },
  })
}
