import type { CollectionConfig } from 'payload'

export const AgencyQuotes: CollectionConfig = {
  slug: 'agency-quotes',
  admin: {
    useAsTitle: 'clientName',
    defaultColumns: ['clientName', 'email', 'budgetTier', 'status', 'createdAt'],
  },
  fields: [
    { name: 'clientName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'companyName', type: 'text' },
    {
      name: 'budgetTier',
      type: 'select',
      required: true,
      options: [
        { label: '$500 - Starter Website', value: '500' },
        { label: '$1,200 - Pro Website', value: '1200' },
        { label: 'Custom - Enterprise/AI', value: 'custom' },
      ],
    },
    { name: 'projectDesc', type: 'textarea', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Contacting', value: 'contacting' },
        { label: 'Won', value: 'won' },
        { label: 'Lost', value: 'lost' },
      ],
    },
  ],
}
