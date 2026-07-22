import type { CollectionConfig } from 'payload'

/** Payload admin auth users — separate from Prisma/Supabase `users` */
export const PayloadUsers: CollectionConfig = {
  slug: 'payload-users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [],
}
