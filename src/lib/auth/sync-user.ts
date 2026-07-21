import { prisma } from '@/lib/prisma'

type AuthUserLike = {
  id: string
  email?: string | null
  email_confirmed_at?: string | null
  user_metadata?: Record<string, unknown>
}

/**
 * Ensure a Supabase Auth user exists in the Prisma `users` table.
 * Uses the Auth user id as the Prisma primary key and syncs email/profile.
 */
export async function upsertPrismaUser(user: AuthUserLike) {
  if (!user.email) {
    throw new Error('Supabase user is missing an email address')
  }

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    null

  const avatarUrl =
    (user.user_metadata?.avatar_url as string | undefined) ?? null

  return prisma.user.upsert({
    where: { id: user.id },
    create: {
      id: user.id,
      email: user.email,
      name: displayName,
      avatarUrl,
      emailVerified: !!user.email_confirmed_at,
    },
    update: {
      email: user.email,
      name: displayName ?? undefined,
      avatarUrl: avatarUrl ?? undefined,
      emailVerified: !!user.email_confirmed_at,
    },
  })
}
