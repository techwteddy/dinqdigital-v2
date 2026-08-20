import type { CollectionConfig } from 'payload'
import { getCmsUser } from '@/lib/payload-access'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'orgId', 'date', 'status'],
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    delete: ({ req }) => getCmsUser(req)?.role === 'admin',
  },
  fields: [
    { name: 'orgId', type: 'text', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'date', type: 'date', required: true },
    { name: 'endDate', type: 'date' },
    { name: 'location', type: 'text' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'Ongoing', value: 'ongoing' },
        { label: 'Past', value: 'past' },
      ],
      defaultValue: 'upcoming',
    },
    { name: 'registrationUrl', type: 'text' },
  ],
}
