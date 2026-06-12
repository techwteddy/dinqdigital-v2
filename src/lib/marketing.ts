import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  Layers,
  LineChart,
  Lock,
  Plug,
  Users,
  Zap,
} from 'lucide-react'
import {
  DEMO_DASHBOARD_PATH,
  GITHUB_REPO,
  INSTAGRAM_URL,
  LINKEDIN_URL,
  SUPPORT_EMAIL,
} from '@/lib/site'

export const STATS = [
  { value: '25+', label: 'Verticals built' },
  { value: '100%', label: 'Custom built' },
  { value: '5★', label: 'Client rating' },
  { value: '24/7', label: 'AI agents running' },
] as const

export const LOGO_CLOUD = [
  'Next.js',
  'Supabase',
  'Claude AI',
  'Vercel',
  'Stripe',
  'Resend',
  'Tailwind CSS',
  'TypeScript',
] as const

export const FEATURES: {
  icon: LucideIcon
  title: string
  description: string
}[] = [
  {
    icon: Layers,
    title: 'Premium Web Design',
    description:
      'Custom websites engineered for conversion. No templates, no shortcuts. Built to represent your brand at its best.',
  },
  {
    icon: Zap,
    title: 'AI Agent Deployment',
    description:
      'Deploy autonomous AI agents that qualify leads, answer questions, and capture clients 24/7 while you sleep.',
  },
  {
    icon: Users,
    title: 'Client Portal',
    description:
      'Every client gets a dedicated portal. Project status, milestones, invoices, files, and messages — all in one place.',
  },
  {
    icon: Plug,
    title: 'DinqPlus Integration',
    description:
      'Connect your business to 25 vertical-specific modules. From bookings to payments — one platform for everything.',
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description:
      'Supabase-powered auth, encrypted data, role-based access, and audit logs built in.',
  },
  {
    icon: LineChart,
    title: 'Real-time Analytics',
    description:
      'Track your business performance in real time. Dashboards that update live across every vertical.',
  },
]

export const STEPS = [
  {
    step: '01',
    icon: Zap,
    title: 'Start your project',
    description:
      "Tell us what you need. We'll scope, design, and build your custom solution from scratch. No templates.",
  },
  {
    step: '02',
    icon: Layers,
    title: 'Connect your stack',
    description:
      'We integrate your existing tools or set up a complete DinqPlus ecosystem tailored to your business vertical.',
  },
  {
    step: '03',
    icon: BarChart3,
    title: 'Grow with confidence',
    description:
      'Track performance, deploy AI agents, and scale your business with real-time insights you can act on today.',
  },
] as const

export const PLANS = [
  {
    name: 'Starter Website',
    price: '$500',
    period: ' one-time',
    description:
      'For small businesses getting their first professional website.',
    features: [
      'Custom website design',
      'Up to 5 pages',
      'Mobile responsive',
      'Basic SEO',
      '1 month support',
    ],
    cta: 'Start a Project',
    href: '/auth/register',
    highlighted: false,
  },
  {
    name: 'Pro Website',
    price: '$1,200',
    period: ' one-time',
    description: 'For growing businesses that need more power.',
    features: [
      'Custom website + animations',
      'Up to 10 pages',
      'DinqPlus integration',
      'DinqAgent widget',
      '3 months support',
      'Client portal access',
    ],
    cta: 'Start a Project',
    href: '/auth/register',
    highlighted: true,
  },
  {
    name: 'Enterprise / AI',
    price: 'Custom',
    period: '',
    description: 'For organizations with advanced needs.',
    features: [
      'Full DinqPlus setup',
      'Custom AI agents',
      'Multi-vertical deployment',
      'Dedicated support',
      'Custom contracts & SLA',
      'Security review',
    ],
    cta: 'Contact us',
    href: `mailto:${SUPPORT_EMAIL}`,
    highlighted: false,
  },
] as const

export const TESTIMONIALS = [
  {
    quote:
      'Dinq Digital built our salon booking system from scratch. We went from pen and paper to a full digital operation in weeks.',
    author: 'Nice Braids',
    role: 'Salon Owner',
    company: 'Seattle',
  },
  {
    quote:
      'The DinqShop system transformed how we manage our auto repair shop. Invoicing, scheduling, and client management all in one place.',
    author: 'G&M Auto Repair',
    role: 'Auto Repair Shop',
    company: 'Seattle',
  },
  {
    quote:
      'Tita PLC needed a factory management system built fast. Dinq delivered a full production tracking platform in record time.',
    author: 'Tita PLC',
    role: 'Polypropylene Manufacturer',
    company: 'Ethiopia',
  },
] as const

export const FAQ_ITEMS = [
  {
    question: 'Do you build custom websites?',
    answer:
      'Yes. Every website we build is 100% custom — no templates, no page builders. We design and develop from scratch using Next.js, Tailwind, and modern web technologies.',
  },
  {
    question: 'What is DinqPlus?',
    answer:
      'DinqPlus is our business operating system — a platform with 25 vertical-specific modules for salons, restaurants, auto shops, factories, and more. Every client site can connect to DinqPlus as a headless CMS and business management system.',
  },
  {
    question: 'What is DinqAgent?',
    answer:
      'DinqAgent is our AI-powered chat widget that lives on your website. It answers visitor questions, qualifies leads, captures contact information, and escalates to you when needed — 24/7 without human input.',
  },
  {
    question: 'How long does a project take?',
    answer:
      'Most websites are delivered in 2–4 weeks depending on complexity. AI agent deployments typically take 1–2 weeks after the website is live.',
  },
] as const

export const NAV_LINKS = [
  { href: '#features', label: 'Services' },
  { href: '#showcase', label: 'DinqPlus' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
] as const

export const FOOTER_LINKS = {
  product: [
    { href: '#features', label: 'Services' },
    { href: '#showcase', label: 'DinqPlus' },
    { href: DEMO_DASHBOARD_PATH, label: 'View Demo' },
    { href: '#pricing', label: 'Pricing' },
  ],
  company: [
    { href: '/terms', label: 'Terms' },
    { href: '/privacy', label: 'Privacy' },
  ],
  connect: [
    { href: LINKEDIN_URL, label: 'LinkedIn', external: true },
    { href: INSTAGRAM_URL, label: 'Instagram', external: true },
    { href: GITHUB_REPO, label: 'GitHub', external: true },
    { href: `mailto:${SUPPORT_EMAIL}`, label: 'Contact', external: true },
  ],
} as const

export const SHOWCASE_ITEMS = [
  {
    title: 'Unified Dashboard',
    description: 'Every metric and action in one place.',
    gradient: 'from-primary/20 to-blue-500/10',
  },
  {
    title: '25 Verticals',
    description: 'From salons to factories, every business type covered.',
    gradient: 'from-violet-500/20 to-fuchsia-500/10',
  },
  {
    title: 'AI Insights',
    description: 'Understand performance at a glance.',
    gradient: 'from-emerald-500/20 to-teal-500/10',
  },
] as const
