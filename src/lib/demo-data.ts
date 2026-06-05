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
  usagePercent: 68,
  usageLabel: 'API requests',
  usageUsed: '68,420',
  usageLimit: '100,000',
}

export const DEMO_TEAM = [
  {
    id: '1',
    name: 'Alex Rivera',
    email: 'alex@acme.co',
    role: 'Owner',
    status: 'active' as const,
  },
  {
    id: '2',
    name: 'Sarah Mitchell',
    email: 'sarah@acme.co',
    role: 'Admin',
    status: 'active' as const,
  },
  {
    id: '3',
    name: 'James Kim',
    email: 'james@acme.co',
    role: 'Member',
    status: 'active' as const,
  },
  {
    id: '4',
    name: 'Priya Sharma',
    email: 'priya@acme.co',
    role: 'Member',
    status: 'away' as const,
  },
  {
    id: '5',
    name: 'Morgan Lee',
    email: 'morgan@acme.co',
    role: 'Member',
    status: 'invited' as const,
  },
]

export const DEMO_INVOICES = [
  {
    id: 'inv_001',
    date: 'May 28, 2026',
    amount: '$29.00',
    status: 'paid' as const,
    description: 'Pro plan — monthly',
  },
  {
    id: 'inv_002',
    date: 'Apr 28, 2026',
    amount: '$29.00',
    status: 'paid' as const,
    description: 'Pro plan — monthly',
  },
  {
    id: 'inv_003',
    date: 'Mar 28, 2026',
    amount: '$29.00',
    status: 'paid' as const,
    description: 'Pro plan — monthly',
  },
  {
    id: 'inv_004',
    date: 'Feb 28, 2026',
    amount: '$0.00',
    status: 'paid' as const,
    description: 'Trial period',
  },
]

export const DEMO_ANALYTICS = {
  conversionRate: '4.8%',
  conversionChange: '+0.6%',
  sessions: '12,840',
  sessionsChange: '+18%',
  bounceRate: '32%',
  bounceChange: '-4%',
  topSources: [
    { source: 'Organic search', visits: 4820, percent: 38 },
    { source: 'Direct', visits: 3210, percent: 25 },
    { source: 'Referral', visits: 2560, percent: 20 },
    { source: 'Email', visits: 2250, percent: 17 },
  ],
}

export const DEMO_NOTIFICATIONS = [
  {
    id: '1',
    title: 'Report ready',
    body: 'Weekly analytics export completed.',
    time: '5m ago',
    read: false,
  },
  {
    id: '2',
    title: 'New team member',
    body: 'Morgan accepted your invitation.',
    time: '2h ago',
    read: false,
  },
  {
    id: '3',
    title: 'Billing reminder',
    body: 'Pro plan renews in 12 days.',
    time: '1d ago',
    read: true,
  },
]
