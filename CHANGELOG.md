# Changelog

All notable changes to LaunchKit will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2025-01-01

### 🎉 Initial Release

**Authentication**
- Email/password sign up and sign in via Supabase Auth
- Magic link (passwordless) authentication
- Google OAuth integration
- GitHub OAuth integration
- Password reset flow with email confirmation
- SSR-safe session management using `@supabase/ssr`
- Middleware-based route protection for `/dashboard`, `/org`, `/settings`

**Multi-tenancy**
- Organization creation with URL-safe slugs
- Role-based access control: `SUPER_ADMIN`, `ADMIN`, `MEMBER`
- Token-based team invitations with 7-day expiry
- Organization member management

**Billing**
- Stripe Checkout Sessions with 14-day free trial
- Subscription lifecycle management (create, update, cancel)
- Stripe Billing Portal for self-serve subscription management
- Webhook handlers: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- Three default plans: Starter ($9/mo), Pro ($29/mo), Enterprise ($99/mo)
- Seeded pricing data via `npm run db:seed`

**Database**
- Full Prisma schema: `User`, `Organization`, `OrganizationMember`, `Invitation`, `Subscription`, `Plan`, `AuditLog`
- Migration infrastructure ready
- Singleton Prisma client (hot-reload safe)

**UI & Frontend**
- Next.js 15 App Router with full Server Components support
- Public landing page with hero, features, and pricing sections
- Auth pages: Login, Register, Forgot Password
- Dashboard layout with sidebar navigation
- Dashboard overview with org cards
- Dark mode via `next-themes` (system-aware, no flash)
- shadcn/ui component foundation: Toast, all Radix primitives
- Tailwind CSS with design tokens via CSS custom properties
- Geist font family

**Developer Experience**
- TypeScript 5.6 strict mode throughout
- `@/` path aliases configured
- ESLint (next/core-web-vitals + @typescript-eslint + prettier)
- Prettier with `prettier-plugin-tailwindcss`
- Husky + lint-staged pre-commit hooks
- Jest + React Testing Library setup
- GitHub Actions CI: lint → type-check → test → build

**Security**
- Security headers: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`
- Stripe webhook signature verification
- Zod validation on all API routes
- Server-side role checks on protected endpoints
- Admin Supabase client isolated to server-only code

---

[1.0.0]: https://github.com/OmarSharaf/launchkit/releases/tag/v1.0.0
