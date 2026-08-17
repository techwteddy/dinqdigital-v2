import type { CollectionConfig } from 'payload'
import { orgIdContentField, orgScopedAccess } from '@/lib/payload-access'

export const Milestones: CollectionConfig = {
  slug: 'milestones',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'project', 'status', 'dueDate'],
  },
  access: orgScopedAccess,
  fields: [
    orgIdContentField,
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
