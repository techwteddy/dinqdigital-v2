import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  Bell,
  Layers,
  LineChart,
  Lock,
  Plug,
  Users,
  Workflow,
  Zap,
} from 'lucide-react'
import {
  APP_NAME,
  DEVELOPER_LINKEDIN,
  DEVELOPER_URL,
  DEMO_DASHBOARD_PATH,
  DOCS_URL,
  SUPPORT_EMAIL,
} from '@/lib/site'

export const STATS = [
  { value: '12,000+', label: 'Teams worldwide' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '4.9★', label: 'Average rating' },
  { value: '2M+', label: 'Tasks automated monthly' },
] as const

export const LOGO_CLOUD = [
  'Stripe',
  'Notion',
  'Linear',
  'Slack',
  'HubSpot',
  'Figma',
] as const

export const FEATURES: {
  icon: LucideIcon
  title: string
  description: string
}[] = [
  {
    icon: LineChart,
    title: 'Real-time analytics',
    description:
      'See what is happening across your business the moment it happens — dashboards that update live.',
  },
  {
    icon: Workflow,
    title: 'Smart automation',
    description:
      'Build workflows in minutes. Trigger actions, send notifications, and eliminate repetitive work.',
  },
  {
    icon: Users,
    title: 'Team workspaces',
    description:
      'Invite your team, assign roles, and collaborate in shared spaces with full permission control.',
  },
  {
    icon: Plug,
    title: 'Integrations',
    description:
      'Connect the tools you already use. Sync data, webhooks, and API access included on every plan.',
  },
  {
    icon: Lock,
    title: 'Enterprise security',
    description:
      'SOC 2-ready practices, encrypted data at rest and in transit, and audit logs for compliance.',
  },
  {
    icon: Bell,
    title: 'Actionable alerts',
    description:
      'Get notified when it matters. Custom thresholds, Slack and email delivery, and digest summaries.',
  },
]

export const STEPS = [
  {
    step: '01',
    icon: Zap,
    title: 'Create your workspace',
    description: `Sign up in under a minute. No credit card required to explore ${APP_NAME}.`,
  },
  {
    step: '02',
    icon: Layers,
    title: 'Connect your stack',
    description:
      'Import data from your existing tools or start fresh with our templates and guided setup.',
  },
  {
    step: '03',
    icon: BarChart3,
    title: 'Grow with confidence',
    description:
      'Track KPIs, automate workflows, and scale your team with insights you can act on today.',
  },
] as const

export const PLANS = [
  {
    name: 'Starter',
    price: '$9',
    period: '/month',
    description: 'For individuals and small teams getting started.',
    features: [
      '1 workspace',
      'Up to 3 team members',
      'Core analytics',
      '5 automations',
      'Email support',
    ],
    cta: 'Start free trial',
    href: '/auth/register',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For growing teams that need more power.',
    features: [
      'Unlimited workspaces',
      'Up to 25 members',
      'Advanced analytics',
      'Unlimited automations',
      'Priority support',
      'API access',
    ],
    cta: 'Start free trial',
    href: '/auth/register',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For organizations with advanced needs.',
    features: [
      'Unlimited everything',
      'SSO / SAML',
      'Dedicated success manager',
      'Custom contracts & SLA',
      'Security review',
    ],
    cta: 'Contact sales',
    href: `mailto:${SUPPORT_EMAIL}`,
    highlighted: false,
  },
] as const

export const TESTIMONIALS = [
  {
    quote: `${APP_NAME} replaced three tools we were duct-taping together. Our ops team finally has one source of truth.`,
    author: 'Alex Chen',
    role: 'Head of Operations',
    company: 'Flowstack',
  },
  {
    quote:
      'We cut reporting time by 70% in the first month. The dashboards are beautiful and actually useful.',
    author: 'Sarah Mitchell',
    role: 'VP Product',
    company: 'Nimbus',
  },
  {
    quote:
      'Onboarding new hires used to take days. Now they are productive on day one with clear workflows.',
    author: 'James Okonkwo',
    role: 'COO',
    company: 'DataPulse',
  },
] as const

export const FAQ_ITEMS = [
  {
    question: 'Is there a free trial?',
    answer:
      'Yes. Every plan includes a 14-day free trial with full access to Pro features. No credit card required to start.',
  },
  {
    question: 'Can I change plans later?',
    answer:
      'Absolutely. Upgrade or downgrade anytime from your billing settings. Changes take effect on your next billing cycle.',
  },
  {
    question: 'Do you offer demos for enterprise teams?',
    answer:
      `Yes. Explore the live demo dashboard anytime, or contact us at ${SUPPORT_EMAIL} for a personalized walkthrough.`,
  },
  {
    question: 'How secure is my data?',
    answer:
      'We use industry-standard encryption, regular security audits, and never sell your data. Enterprise plans include SSO and advanced compliance options.',
  },
] as const

export const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#showcase', label: 'Product' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
] as const

export const FOOTER_LINKS = {
  product: [
    { href: '#features', label: 'Features' },
    { href: DEMO_DASHBOARD_PATH, label: 'Live demo' },
    { href: '#pricing', label: 'Pricing' },
    { href: DOCS_URL, label: 'Help center', external: true },
  ],
  company: [
    { href: '/terms', label: 'Terms' },
    { href: '/privacy', label: 'Privacy' },
  ],
  connect: [
    { href: DEVELOPER_LINKEDIN, label: 'LinkedIn', external: true },
    { href: DEVELOPER_URL, label: 'Contact', external: true },
  ],
} as const

export const SHOWCASE_ITEMS = [
  {
    title: 'Unified dashboard',
    description: 'Every metric and action in one place.',
    gradient: 'from-primary/20 to-blue-500/10',
  },
  {
    title: 'Workflow builder',
    description: 'Drag, drop, and automate in minutes.',
    gradient: 'from-violet-500/20 to-fuchsia-500/10',
  },
  {
    title: 'Team insights',
    description: 'Understand performance at a glance.',
    gradient: 'from-emerald-500/20 to-teal-500/10',
  },
] as const
