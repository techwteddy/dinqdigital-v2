import type { CollectionConfig } from 'payload'
import { orgScopedAccess } from '@/lib/payload-access'

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'companyName',
    defaultColumns: ['companyName', 'contactName', 'email', 'plan', 'status'],
  },
  access: orgScopedAccess,
  fields: [
    { name: 'orgId', type: 'text' },
    { name: 'companyName', type: 'text', required: true },
    { name: 'contactName', type: 'text' },
    { name: 'email', type: 'email' },
    {
      name: 'plan',
      type: 'select',
      options: [
        { label: '$500', value: '500' },
        { label: '$1200', value: '1200' },
        { label: 'Custom', value: 'custom' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Paused', value: 'paused' },
        { label: 'Completed', value: 'completed' },
      ],
    },
    { name: 'website', type: 'text' },
    { name: 'notes', type: 'textarea' },
  ],
}
