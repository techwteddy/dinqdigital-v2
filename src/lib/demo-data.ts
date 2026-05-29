/**
 * Mock data for the public demo dashboard (no auth required).
 */

export const DEMO_USER = {
  name: 'Alex Rivera',
  email: 'alex@acme.co',
  initials: 'AR',
}

export const DEMO_ORG = {
  name: 'Acme Corporation',
  plan: 'Pro',
  members: 12,
}

export const DEMO_ORGANIZATIONS = [
  {
    id: '1',
    name: 'Acme Corporation',
    role: 'admin' as const,
    members: 12,
    plan: 'Pro',
    active: true,
    renewsIn: '12 days',
  },
  {
    id: '2',
    name: 'Studio North',
    role: 'member' as const,
    members: 5,
    plan: 'Starter',
    active: true,
    renewsIn: '28 days',
  },
]

export const DEMO_ACTIVITY = [
  {
    id: '1',
    action: 'Report exported',
    user: 'Sarah M.',
    time: '2m ago',
    type: 'success' as const,
  },
  {
    id: '2',
    action: 'Workflow automated',
    user: 'James K.',
    time: '18m ago',
    type: 'info' as const,
  },
  {
    id: '3',
    action: 'New team member invited',
    user: 'Alex R.',
    time: '1h ago',
    type: 'info' as const,
  },
  {
    id: '4',
    action: 'Billing updated to Pro',
    user: 'System',
    time: '3h ago',
    type: 'success' as const,
  },
  {
    id: '5',
    action: 'API key rotated',
    user: 'Priya S.',
    time: '5h ago',
    type: 'warning' as const,
  },
]

export const DEMO_CHART_WEEKLY = [
  { label: 'Mon', value: 62 },
  { label: 'Tue', value: 78 },
  { label: 'Wed', value: 55 },
  { label: 'Thu', value: 91 },
  { label: 'Fri', value: 84 },
  { label: 'Sat', value: 48 },
  { label: 'Sun', value: 70 },
]

export const DEMO_METRICS = [
  { label: 'Active users', value: '2,847', change: '+12.4%', up: true },
  { label: 'Tasks completed', value: '18.2k', change: '+8.1%', up: true },
  { label: 'Avg. response', value: '1.2s', change: '-18%', up: true },
  { label: 'Revenue (MRR)', value: '$24.5k', change: '+5.2%', up: true },
]

export const DEMO_BILLING = {
  plan: 'Pro',
  price: '$29',
  period: 'month',
  status: 'Active',
  nextBilling: 'June 28, 2026',
  paymentMethod: 'Visa •••• 4242',
}
