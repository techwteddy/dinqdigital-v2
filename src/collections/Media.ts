import type { CollectionConfig } from 'payload'
import { orgIdContentField, orgScopedAccess } from '@/lib/payload-access'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: true,
  access: orgScopedAccess,
  fields: [
    orgIdContentField,
    {
      name: 'alt',
      type: 'text',
    },
  ],
}
