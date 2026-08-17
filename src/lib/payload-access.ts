import type { Access, CollectionConfig } from 'payload'

type CmsUser = {
  role?: string | null
  orgId?: string | null
}

export function getCmsUser(req: { user?: unknown }): CmsUser | null {
  if (!req.user || typeof req.user !== 'object') return null
  return req.user as CmsUser
}

const orgIdField = {
  name: 'orgId',
  type: 'text',
  label: 'Organization ID',
  admin: {
    description: 'Client org ID — leave blank for agency content',
  },
} as const

export const orgIdContentField = orgIdField

/** Org-scoped content: Ted (admin) sees all; editors only see their orgId. */
export const orgScopedAccess: CollectionConfig['access'] = {
  read: (({ req }) => {
    const user = getCmsUser(req)
    if (!user) return false
    if (user.role === 'admin') return true
    if (user.orgId) {
      return { orgId: { equals: user.orgId } }
    }
    return false
  }) satisfies Access,
  create: (({ req }) => Boolean(req.user)) satisfies Access,
  // Payload AccessArgs expose `data`/`id`, not `doc` — constrain by orgId query.
  update: (({ req }) => {
    const user = getCmsUser(req)
    if (!user) return false
    if (user.role === 'admin') return true
    if (user.orgId) {
      return { orgId: { equals: user.orgId } }
    }
    return false
  }) satisfies Access,
  delete: (({ req }) => getCmsUser(req)?.role === 'admin') satisfies Access,
}

export const adminOnlyAccess: CollectionConfig['access'] = {
  read: (({ req }) => getCmsUser(req)?.role === 'admin') satisfies Access,
  create: (() => true) satisfies Access,
  update: (({ req }) => getCmsUser(req)?.role === 'admin') satisfies Access,
  delete: (({ req }) => getCmsUser(req)?.role === 'admin') satisfies Access,
}
