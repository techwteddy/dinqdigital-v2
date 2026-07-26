import type { CollectionConfig } from 'payload'

export const Deals: CollectionConfig = {
  slug: 'deals',
  admin: {
    useAsTitle: 'client',
    defaultColumns: ['client', 'value', 'stage', 'startDate'],
  },
  fields: [
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
    },
    { name: 'value', type: 'number' },
    {
      name: 'stage',
      type: 'select',
      options: [
        { label: 'Discovery', value: 'discovery' },
        { label: 'Proposal', value: 'proposal' },
        { label: 'Won', value: 'won' },
        { label: 'Lost', value: 'lost' },
      ],
    },
    { name: 'startDate', type: 'date' },
    { name: 'notes', type: 'textarea' },
  ],
}
