import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import '@/styles/globals.css'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://launchkit.dev'
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'LaunchKit'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} — Ship Your SaaS Faster`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    'Production-ready SaaS boilerplate with Next.js 15, Supabase, Prisma, and Stripe. Everything you need to go from idea to paying customers — fast.',
  keywords: [
    'saas boilerplate',
    'nextjs starter',
    'supabase starter',
    'stripe billing',
    'multi-tenant saas',
    'typescript boilerplate',
  ],
  authors: [
    {
      name: 'Omar S. M. Abdelfatah',
      url: 'https://www.omarsharaf.me',
    },
  ],
  creator: 'Omar S. M. Abdelfatah',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    title: `${APP_NAME} — Ship Your SaaS Faster`,
    description:
      'Production-ready SaaS boilerplate with Next.js 15, Supabase, Prisma, and Stripe.',
    siteName: APP_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} — Ship Your SaaS Faster`,
    description:
      'Production-ready SaaS boilerplate with Next.js 15, Supabase, Prisma, and Stripe.',
    creator: '@OmarSharaf',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
