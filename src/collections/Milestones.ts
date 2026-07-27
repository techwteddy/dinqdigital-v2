import type { CollectionConfig } from 'payload'

export const Milestones: CollectionConfig = {
  slug: 'milestones',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'project', 'status', 'dueDate'],
  },
  fields: [
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
    },
    { name: 'title', type: 'text', required: true },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Complete', value: 'complete' },
      ],
    },
    { name: 'dueDate', type: 'date' },
    { name: 'notes', type: 'textarea' },
  ],
}
