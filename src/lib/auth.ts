import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { cache } from 'react'

/**
 * Returns the current authenticated Supabase user, or null.
 * Cached per-request using React cache().
 */
export const getUser = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

/**
 * Returns the current authenticated user's database record.
 * Cached per-request.
 */
export const getDbUser = cache(async () => {
  const user = await getUser()
  if (!user) return null

  return prisma.user.findUnique({
    where: { id: user.id },
  })
})

/**
 * Requires the user to be authenticated.
 * Redirects to /auth/login if not authenticated.
 */
export async function requireAuth() {
  const user = await getUser()
  if (!user) redirect('/auth/login')
  return user
}

/**
 * Requires the user to be unauthenticated.
 * Redirects to /dashboard if already authenticated.
 */
export async function requireGuest() {
  const user = await getUser()
  if (user) redirect('/dashboard')
}

/**
 * Returns the user's organization membership for a given org slug.
 */
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
