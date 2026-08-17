import type { CollectionConfig } from 'payload'
import { orgIdContentField, orgScopedAccess } from '@/lib/payload-access'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
  },
  access: orgScopedAccess,
  fields: [
    orgIdContentField,
    { name: 'title', type: 'text', required: true },
    { name: 'content', type: 'textarea' },
    { name: 'slug', type: 'text' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
  ],
}
