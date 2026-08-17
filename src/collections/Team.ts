import type { CollectionConfig } from 'payload'
import { orgIdContentField, orgScopedAccess } from '@/lib/payload-access'

export const Team: CollectionConfig = {
  slug: 'team',
  admin: {
    useAsTitle: 'name',
  },
  access: orgScopedAccess,
  fields: [
    orgIdContentField,
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text' },
    { name: 'bio', type: 'textarea' },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
