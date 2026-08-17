import type { CollectionConfig } from 'payload'

/** Payload admin auth users — separate from Prisma/Supabase `users` */
export const PayloadUsers: CollectionConfig = {
  slug: 'payload-users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      defaultValue: 'editor',
      required: true,
    },
    {
      name: 'orgId',
      type: 'text',
      label: 'Organization ID',
      admin: {
        description: 'Leave blank for admin users',
      },
    },
  ],
}
