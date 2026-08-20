import type { CollectionConfig } from 'payload'
import { getCmsUser } from '@/lib/payload-access'

export const Domains: CollectionConfig = {
  slug: 'domains',
  admin: {
    useAsTitle: 'domain',
    defaultColumns: ['domain', 'orgId', 'siteName', 'industry', 'isActive'],
  },
  access: {
    read: () => true,
    create: ({ req }) => getCmsUser(req)?.role === 'admin',
    update: ({ req }) => getCmsUser(req)?.role === 'admin',
    delete: ({ req }) => getCmsUser(req)?.role === 'admin',
  },
  fields: [
    {
      name: 'domain',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Hostname only, e.g. bridgetobright.org',
      },
    },
    { name: 'orgId', type: 'text', required: true },
    { name: 'siteName', type: 'text' },
    {
      name: 'industry',
      type: 'select',
      options: [
        { label: 'Beauty', value: 'beauty' },
        { label: 'Auto', value: 'auto' },
        { label: 'Restaurant', value: 'restaurant' },
        { label: 'Nonprofit', value: 'nonprofit' },
        { label: 'Professional', value: 'professional' },
        { label: 'Healthcare', value: 'healthcare' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'primaryColor',
      type: 'text',
      defaultValue: '#000000',
    },
    {
      name: 'accentColor',
      type: 'text',
      defaultValue: '#6C5CE7',
    },
    { name: 'heroTitle', type: 'text' },
    { name: 'heroDescription', type: 'textarea' },
    { name: 'heroCtaText', type: 'text' },
    { name: 'heroCtaUrl', type: 'text' },
    { name: 'contactEmail', type: 'text' },
    { name: 'contactPhone', type: 'text' },
    { name: 'contactAddress', type: 'text' },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
