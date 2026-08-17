import type { CollectionConfig } from 'payload'
import { orgScopedAccess } from '@/lib/payload-access'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'clientName',
    defaultColumns: ['clientName', 'orgId', 'status', 'startDate', 'value'],
  },
  access: orgScopedAccess,
  fields: [
    { name: 'clientName', type: 'text', required: true },
    { name: 'orgId', type: 'text', required: true },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Discovery', value: 'discovery' },
        { label: 'Design', value: 'design' },
        { label: 'Dev', value: 'dev' },
        { label: 'QA', value: 'qa' },
        { label: 'Launch', value: 'launch' },
        { label: 'Complete', value: 'complete' },
      ],
    },
    { name: 'startDate', type: 'date' },
    { name: 'estimatedEndDate', type: 'date' },
    { name: 'value', type: 'number' },
    { name: 'notes', type: 'textarea' },
  ],
}
