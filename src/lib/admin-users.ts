import { createAdminClient } from '@/lib/supabase/server'

export type PortalUser = {
  id: string
  email: string
  fullName: string
  createdAt: string
}

export async function listPortalUsers(): Promise<PortalUser[]> {
  const supabase = createAdminClient()
  const users: PortalUser[] = []
  let page = 1
  const perPage = 200

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    })

    if (error) throw error

    for (const user of data.users) {
      const fullName =
        (typeof user.user_metadata?.full_name === 'string'
          ? user.user_metadata.full_name
          : null) ||
        (typeof user.user_metadata?.name === 'string'
          ? user.user_metadata.name
          : null) ||
        '—'

      users.push({
        id: user.id,
        email: user.email ?? '—',
        fullName,
        createdAt: user.created_at,
      })
    }

    if (data.users.length < perPage) break
    page += 1
    if (page > 50) break
  }

  users.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return users
}

export async function countPortalUsers(): Promise<number> {
  const users = await listPortalUsers()
  return users.length
}
