<div align="center">

<br />

```
██╗      █████╗ ██╗   ██╗███╗   ██╗ ██████╗██╗  ██╗██╗  ██╗██╗████████╗
██║     ██╔══██╗██║   ██║████╗  ██║██╔════╝██║  ██║██║ ██╔╝██║╚══██╔══╝
██║     ███████║██║   ██║██╔██╗ ██║██║     ███████║█████╔╝ ██║   ██║
██║     ██╔══██║██║   ██║██║╚██╗██║██║     ██╔══██║██╔═██╗ ██║   ██║
███████╗██║  ██║╚██████╔╝██║ ╚████║╚██████╗██║  ██║██║  ██╗██║   ██║
╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝   ╚═╝
```

### The production-ready SaaS boilerplate. Ship in days, not months.

<br />

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Billing-635BFF?style=flat-square&logo=stripe&logoColor=white)](https://stripe.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://prisma.io/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](./CONTRIBUTING.md)
[![Stars](https://img.shields.io/github/stars/OmarSharaf/launchkit?style=flat-square&logo=github)](https://github.com/OmarSharaf/launchkit/stargazers)

<br />

**[🚀 Live Demo](https://www.omarsharaf.me)** &nbsp;·&nbsp; **[📖 Docs](https://github.com/OmarSharaf/launchkit/wiki)** &nbsp;·&nbsp; **[🐛 Report Bug](https://github.com/OmarSharaf/launchkit/issues/new?template=bug_report.md)** &nbsp;·&nbsp; **[✨ Request Feature](https://github.com/OmarSharaf/launchkit/issues/new?template=feature_request.md)**

<br />

> Every SaaS needs auth, billing, multi-tenancy, a database, CI/CD, and a clean UI.
> LaunchKit gives you all of it — wired together, tested, and ready to ship.

<br />

</div>

---

## 📋 Table of Contents

- [What's Included](#-whats-included)
- [Tech Stack](#%EF%B8%8F-tech-stack)
- [Quickstart](#-quickstart)
- [Project Structure](#-project-structure)
- [Authentication Flow](#-authentication-flow)
- [Billing Flow](#-billing-flow)
- [Database Schema](#%EF%B8%8F-database-schema)
- [Deployment](#-deployment)
- [Roadmap](#%EF%B8%8F-roadmap)
- [Contributing](#-contributing)
- [Author](#-author)
- [License](#-license)

---

## ✨ What's Included

Everything you need to go from idea to paying customers:

| Feature | Details |
|---|---|
| 🔐 **Authentication** | Email/password, magic links, Google OAuth, GitHub OAuth via Supabase Auth |
| 🏢 **Multi-tenancy** | Organizations with roles (`SUPER_ADMIN` / `ADMIN` / `MEMBER`) + team invitations |
| 💳 **Stripe Billing** | Checkout sessions, subscription webhooks, billing portal, free trials |
| 🛡️ **Route Protection** | Middleware-based auth guards — no boilerplate per page |
| 🗄️ **Type-safe DB** | PostgreSQL via Supabase + Prisma ORM — fully typed, zero runtime surprises |
| 📧 **Transactional Email** | Resend integration — ready to send invites, receipts, notifications |
| 🎨 **UI Components** | shadcn/ui + Radix UI + Tailwind CSS — accessible, customizable, beautiful |
| 🌗 **Dark Mode** | System-aware theme switching via next-themes, no flash |
| 📋 **Audit Logs** | Track every important action across your organization |
| ✅ **End-to-end Validation** | Zod schemas shared between client forms and server handlers |
| 🧪 **Testing Setup** | Jest + React Testing Library — configured and ready |
| 🔄 **CI/CD Pipeline** | GitHub Actions — lint → type-check → test → build on every PR |
| 🔒 **Security Headers** | X-Frame-Options, X-Content-Type-Options, Referrer-Policy — set by default |
| 📦 **Developer Experience** | ESLint, Prettier, Husky, lint-staged, conventional commits |

---

## 🖥️ Tech Stack

<table>
  <tr>
    <td><strong>Layer</strong></td>
    <td><strong>Technology</strong></td>
    <td><strong>Why</strong></td>
  </tr>
  <tr>
    <td>Framework</td>
    <td>Next.js 15 (App Router)</td>
    <td>Server Components, Server Actions, edge-ready, Vercel-optimized</td>
  </tr>
  <tr>
    <td>Language</td>
    <td>TypeScript 5.6 (strict)</td>
    <td>End-to-end type safety, fewer runtime errors, better DX</td>
  </tr>
  <tr>
    <td>Auth</td>
    <td>Supabase Auth</td>
    <td>JWT, OAuth, magic links, SSR-safe cookie management</td>
  </tr>
  <tr>
    <td>Database</td>
    <td>PostgreSQL + Prisma ORM</td>
    <td>Relational, type-safe queries, migrations, seed scripts</td>
  </tr>
  <tr>
    <td>Hosting DB</td>
    <td>Supabase</td>
    <td>Managed Postgres, connection pooling, Storage, Realtime</td>
  </tr>
  <tr>
    <td>Payments</td>
    <td>Stripe</td>
    <td>Checkout, subscriptions, billing portal, webhooks</td>
  </tr>
  <tr>
    <td>Email</td>
    <td>Resend</td>
    <td>Reliable transactional email with a great developer API</td>
  </tr>
  <tr>
    <td>UI</td>
    <td>Tailwind CSS + shadcn/ui + Radix UI</td>
    <td>Accessible, unstyled primitives — fully yours to customize</td>
  </tr>
  <tr>
    <td>Forms</td>
    <td>React Hook Form + Zod</td>
    <td>Performant forms with schema-driven validation</td>
  </tr>
  <tr>
    <td>State</td>
    <td>Zustand</td>
    <td>Lightweight, flexible client-side state management</td>
  </tr>
  <tr>
    <td>Testing</td>
    <td>Jest + React Testing Library</td>
    <td>Unit and integration tests — configured out of the box</td>
  </tr>
  <tr>
    <td>Deployment</td>
    <td>Vercel (recommended)</td>
    <td>Zero-config Next.js deployment; works on any Node.js host</td>
  </tr>
</table>

---

## ⚡ Quickstart

### Prerequisites

- **Node.js** `>=18.17`
- **npm** `>=9.0`
- A [**Supabase**](https://supabase.com) project (free tier works perfectly)
- A [**Stripe**](https://stripe.com) account (test mode is fine to start)
- A [**Resend**](https://resend.com) account (free tier included)

---

### 1. Clone & Install

```bash
git clone https://github.com/OmarSharaf/launchkit.git
cd launchkit
npm install
```

---

### 2. Configure Environment Variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your values:

```env
# ── App ──────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="LaunchKit"

# ── Supabase (project Settings > API) ────────────────
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# ── Database (Settings > Database > Connection string)
DATABASE_URL="postgresql://postgres.xxxx:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxxx:[password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# ── Stripe (dashboard.stripe.com/apikeys) ────────────
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ── Resend (resend.com/api-keys) ──────────────────────
RESEND_API_KEY=re_...
EMAIL_FROM="LaunchKit <noreply@omarsharaf.me>"
```

> **Tip:** Never commit `.env.local` — it's already in `.gitignore`.

---

### 3. Set Up Supabase Auth

In your Supabase dashboard:

1. Go to **Authentication → URL Configuration**
2. Add `http://localhost:3000/api/auth/callback` to **Redirect URLs**
3. Enable **Google** and/or **GitHub** providers under **Authentication → Providers** (optional)

---

### 4. Set Up the Database

```bash
# Generate the Prisma client from your schema
npx prisma generate

# Push schema to your database and create tables
npx prisma migrate dev --name init

# Seed the database with Starter / Pro / Enterprise plans
npm run db:seed
```

---

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you're live. 🎉

---

### 6. Set Up Stripe Webhooks (Local)

In a new terminal:

```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_...` secret printed to your terminal into `.env.local` as `STRIPE_WEBHOOK_SECRET`.

---

## 📁 Project Structure

```
launchkit/
│
├── prisma/
│   ├── schema.prisma          # Full multi-tenant data model
│   └── seed.ts                # Seeds Starter / Pro / Enterprise plans
│
├── src/
│   ├── app/                   # Next.js 15 App Router
│   │   ├── layout.tsx         # Root layout — fonts, theme, metadata
│   │   ├── page.tsx           # Public landing page
│   │   ├── auth/
│   │   │   ├── layout.tsx     # Auth shell (centered, branded)
│   │   │   ├── login/         # Sign in page + LoginForm component
│   │   │   ├── register/      # Create account + RegisterForm
│   │   │   └── forgot-password/
│   │   ├── dashboard/
│   │   │   ├── layout.tsx     # Sidebar layout (server, reads session)
│   │   │   ├── page.tsx       # Overview — orgs, quick actions
│   │   │   ├── billing/       # Subscription management
│   │   │   └── settings/      # Org settings, member management
│   │   └── api/
│   │       ├── auth/callback/ # Supabase OAuth callback + user sync
│   │       ├── stripe/
│   │       │   └── checkout/  # Create Stripe Checkout Sessions
│   │       └── webhooks/
│   │           └── stripe/    # Handle all Stripe webhook events
│   │
│   ├── components/
│   │   ├── ui/                # Base primitives (Toast, Button, Input…)
│   │   ├── auth/              # LoginForm, RegisterForm, ForgotPasswordForm
│   │   ├── dashboard/         # Dashboard-specific widgets
│   │   ├── marketing/         # Landing page sections
│   │   └── providers/         # ThemeProvider, future: AnalyticsProvider
│   │
│   ├── lib/
│   │   ├── auth.ts            # requireAuth, getUser, getDbUser, getOrganizationMembership
│   │   ├── prisma.ts          # Singleton Prisma client (hot-reload safe)
│   │   ├── stripe.ts          # createCheckoutSession, createBillingPortalSession, formatPrice
│   │   ├── supabase/
│   │   │   ├── client.ts      # Browser Supabase client
│   │   │   └── server.ts      # Server Supabase client + admin client
│   │   ├── utils.ts           # cn, slugify, formatRelativeDate, getInitials, …
│   │   └── validations.ts     # All Zod schemas + exported TS types
│   │
│   ├── hooks/
│   │   ├── use-current-user.ts   # Client-side auth state listener
│   │   ├── use-organization.ts   # Fetch + cache org + subscription
│   │   └── use-toast.ts          # Toast notification state
│   │
│   ├── types/
│   │   └── index.ts           # Composed Prisma types, ApiResponse, NavItem
│   │
│   ├── styles/
│   │   └── globals.css        # Tailwind directives + CSS variables + utilities
│   │
│   └── middleware.ts          # Route protection — guards /dashboard, /org
│
├── .github/
│   ├── workflows/ci.yml       # Lint → Type-check → Test → Build on every push
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── FUNDING.yml
│   ├── labels.yml
│   └── ISSUE_TEMPLATE/        # Bug report & feature request templates
│
├── next.config.ts             # Security headers, image domains, bundle optimizations
├── tailwind.config.ts         # Design tokens, CSS variables, animations
├── tsconfig.json              # Strict TypeScript + @/ path aliases
├── jest.config.ts             # Jest + jsdom + path alias mapping
├── .eslintrc.json             # ESLint: next/core-web-vitals + typescript + prettier
├── .prettierrc                # Prettier config with tailwindcss plugin
├── .env.example               # Fully documented environment variable reference
├── CHANGELOG.md               # Version history
├── CONTRIBUTING.md            # Contribution guidelines
├── CODE_OF_CONDUCT.md
├── SECURITY.md
└── LICENSE                    # MIT — Copyright (c) 2025 Omar S. M. Abdelfatah
```

---

## 🔐 Authentication Flow

```
Browser                     Middleware                  Supabase              Database
   │                            │                          │                     │
   │── GET /dashboard ─────────>│                          │                     │
   │                            │── getUser() ────────────>│                     │
   │                            │<─ null (no session) ─────│                     │
   │<── 302 /auth/login ────────│                          │                     │
   │                            │                          │                     │
   │── POST /auth/login ─────────────────────────────────> │                     │
   │   (email + password)                            signInWithPassword()        │
   │<─ Set-Cookie: sb-... ──────────────────────────────── │                     │
   │                            │                          │                     │
   │── GET /api/auth/callback ──────────────────────────── │                     │
   │   (code exchange)                           exchangeCodeForSession()        │
   │                            │                          │── upsert user ─────>│
   │                            │                          │<─ User record ───── │
   │<── 302 /dashboard ─────────────────────────────────── │                     │
   │                            │                          │                     │
   │── GET /dashboard ─────────>│                          │                     │
   │                            │── getUser() ────────────>│                     │
   │                            │<─ User ──────────────────│                     │
   │<── 200 Dashboard ──────────│                          │                     │
```

**Supported auth methods:**
- ✅ Email + Password
- ✅ Magic Link (passwordless email)
- ✅ Google OAuth
- ✅ GitHub OAuth
- 🔜 SAML / SSO (Enterprise — on roadmap)

---

## 💳 Billing Flow

```
Client                      API                     Stripe                  Database
  │                          │                         │                       │
  │── POST /api/stripe/checkout                        │                       │
  │   { priceId, orgId } ──>│                          │                       │
  │                          │── verify membership ──────────────────────────>│
  │                          │── getOrCreateCustomer ──>│                      │
  │                          │── createCheckoutSession >│                      │
  │                          │<─ { url } ──────────────│                       │
  │<── { url } ─────────────│                          │                       │
  │                          │                          │                       │
  │── redirect to Stripe ──────────────────────────── >│                       │
  │   (user pays)            │                    checkout.session.completed   │
  │                          │<──────────────── POST /api/webhooks/stripe ─── │
  │                          │── upsert Subscription ─────────────────────── >│
  │                          │                          │                       │
  │<── redirect /dashboard/billing?success=true         │                       │
```

**Handled webhook events:**

| Event | Action |
|---|---|
| `checkout.session.completed` | Creates or updates the subscription record |
| `customer.subscription.updated` | Syncs status, period dates, cancel flag |
| `customer.subscription.deleted` | Marks subscription as `CANCELED` |
| `invoice.payment_failed` | Marks subscription as `PAST_DUE` |

---

## 🗄️ Database Schema

Designed for multi-tenant SaaS from day one:

```
┌──────────────┐         ┌──────────────────────┐         ┌──────────────┐
│     User     │────────<│  OrganizationMember  │>────────│ Organization │
│──────────────│         │──────────────────────│         │──────────────│
│ id           │         │ id                   │         │ id           │
│ email        │         │ userId               │         │ name         │
│ name         │         │ organizationId       │         │ slug         │
│ avatarUrl    │         │ role (ADMIN|MEMBER)   │         │ logoUrl      │
│ emailVerified│         │ joinedAt             │         │ stripeCustomerId│
└──────────────┘         └──────────────────────┘         └──────┬───────┘
                                                                  │
                                              ┌───────────────────┼─────────────┐
                                              │                   │             │
                                       ┌──────▼──────┐    ┌──────▼──────┐      │
                                       │ Subscription│    │ Invitation  │      │
                                       │─────────────│    │─────────────│      │
                                       │ stripeSubId │    │ email       │      │
                                       │ status      │    │ role        │      │
                                       │ planId ─────┼─── │ token       │      │
                                       │ periodStart │    │ status      │      │
                                       │ periodEnd   │    └─────────────┘      │
                                       └──────┬──────┘                  ┌──────▼──────┐
                                              │                         │  AuditLog   │
                                       ┌──────▼──────┐                  │─────────────│
                                       │    Plan     │                  │ action      │
                                       │─────────────│                  │ entity      │
                                       │ name        │                  │ metadata    │
                                       │ amount      │                  │ userId      │
                                       │ features    │                  │ createdAt   │
                                       │ isPopular   │                  └─────────────┘
                                       └─────────────┘
```

**Key design decisions:**
- **Organization-centric billing** — subscriptions belong to orgs, not individual users
- **Role-based access control** — `SUPER_ADMIN`, `ADMIN`, `MEMBER` per org
- **Invitation system** — token-based with expiry, pending/accepted/expired states
- **Audit trail** — every significant event is loggable with metadata

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/OmarSharaf/launchkit&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,DATABASE_URL,DIRECT_URL,STRIPE_SECRET_KEY,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,STRIPE_WEBHOOK_SECRET,RESEND_API_KEY)

1. Click the button above — Vercel prompts you to fill in all required env vars
2. After deployment, run database migrations:

```bash
npx prisma migrate deploy
npm run db:seed
```

3. Add your Vercel production URL to Supabase's **Redirect URLs** and your Stripe **webhook endpoint**

---

### Other Platforms

| Platform | How |
|---|---|
| Railway / Render / Fly.io | Connect repo, set env vars, auto-deploy |
| AWS / GCP / Azure | Docker or serverless adapters |
| Self-hosted VPS | `npm run build && npm start` |

---

## 🛣️ Roadmap

**v1.0 — Foundation (current)**
- [x] Email/password + OAuth authentication
- [x] Multi-org multi-tenancy
- [x] Team invitations with role assignment
- [x] Stripe subscriptions (checkout, webhooks, portal)
- [x] Audit log infrastructure
- [x] Full CI/CD pipeline
- [x] Security headers
- [x] Dark mode

**v1.1 — Growth**
- [ ] Usage-based billing (metered Stripe billing)
- [ ] Email notifications (invitations, payment receipts, alerts)
- [ ] Admin super-dashboard
- [ ] API key management
- [ ] In-app notification center

**v1.2 — Enterprise**
- [ ] SAML / SSO integration
- [ ] Advanced RBAC with custom permissions
- [ ] i18n / localization
- [ ] Webhooks for external integrations
- [ ] Data export (CSV / JSON)

> Want to help ship any of these? See [CONTRIBUTING.md](./CONTRIBUTING.md) — PRs are very welcome.

---

## 🤝 Contributing

LaunchKit is open source and contributions are very welcome!

1. Read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines
2. Fork the repo: `git clone https://github.com/OmarSharaf/launchkit.git`
3. Create a branch: `git checkout -b feat/amazing-feature`
4. Commit with conventional commits: `git commit -m "feat: add amazing feature"`
5. Push and open a Pull Request to `develop`

Looking for a good first issue? Check the [`good first issue`](https://github.com/OmarSharaf/launchkit/labels/good%20first%20issue) label.

---

## 👤 Author

<table>
  <tr>
    <td align="center" style="padding: 16px;">
      <a href="https://www.omarsharaf.me">
        <img src="https://github.com/OmarSharaf.png" width="96" alt="Omar S. M. Abdelfatah" style="border-radius:50%; border: 3px solid #3b82f6;" />
        <br /><br />
        <strong>Omar S. M. Abdelfatah</strong>
      </a>
      <br />
      <sub>Founder · Builder · Engineer</sub>
      <br /><br />
      <a href="https://www.omarsharaf.me" title="Website">🌐 omarsharaf.me</a>
      &nbsp;·&nbsp;
      <a href="https://github.com/OmarSharaf" title="GitHub">
        <img src="https://img.shields.io/badge/GitHub-OmarSharaf-181717?style=flat-square&logo=github" alt="GitHub" />
      </a>
      &nbsp;·&nbsp;
      <a href="https://www.linkedin.com/in/omarsharafaldin/" title="LinkedIn">
        <img src="https://img.shields.io/badge/LinkedIn-omarsharafaldin-0A66C2?style=flat-square&logo=linkedin" alt="LinkedIn" />
      </a>
    </td>
  </tr>
</table>

Built with passion from Egypt 🇪🇬 — crafted for the global developer community.

---

## 💬 Community & Support

| Channel | Link |
|---|---|
| 🐛 Bug reports | [GitHub Issues](https://github.com/OmarSharaf/launchkit/issues) |
| 💡 Feature requests | [GitHub Issues](https://github.com/OmarSharaf/launchkit/issues) |
| 💬 Discussions | [GitHub Discussions](https://github.com/OmarSharaf/launchkit/discussions) |
| 🌐 Author's website | [omarsharaf.me](https://www.omarsharaf.me) |
| 💼 LinkedIn | [omarsharafaldin](https://www.linkedin.com/in/omarsharafaldin/) |
| 🌟 Star the project | [GitHub Stars](https://github.com/OmarSharaf/launchkit/stargazers) |

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](./LICENSE) for full text.

MIT means you can use it commercially, modify it, distribute it, and use it privately. The only requirement is keeping the copyright notice.

```
Copyright (c) 2025 Omar S. M. Abdelfatah
```

---

<div align="center">

<br />

**If LaunchKit saved you time, please ⭐ the repo — it helps more developers find it.**

<br />

Made with ❤️ by [Omar S. M. Abdelfatah](https://www.omarsharaf.me)

</div>
