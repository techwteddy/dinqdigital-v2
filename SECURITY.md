# Security Policy

## Supported Versions

| Version | Supported              |
| ------- | ---------------------- |
| 1.x     | :white_check_mark: Yes |
| < 1.0   | :x: No                 |

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

If you discover a security issue, email:

**omarsharaf@msn.com**

Include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact (data exposure, privilege escalation, etc.)
- Suggested fix (if you have one)

You can expect:

- An acknowledgment within **48 hours**
- A status update within **7 days** for critical issues
- A patch release when a fix is available

Valid reports may be credited in release notes at your request.

## Scope

This policy covers:

- The LaunchKit application code in this repository (`src/`, `prisma/`, API routes, middleware)
- Default configuration shipped with the project (`next.config.ts`, `jest.config.ts`)

It does **not** cover:

- Your own Supabase, Stripe, or hosting configuration
- Third-party services you integrate beyond the defaults
- The public **`/demo`** route — it intentionally uses mock data and requires no authentication; do not put real customer data there

## Security Measures Built Into LaunchKit

### Authentication & sessions

- Middleware refreshes Supabase sessions on every matched request via `supabase.auth.getUser()` (not `getSession()` alone)
- Protected prefixes: `/dashboard`, `/org`, `/settings`, `/billing` — unauthenticated users redirect to `/auth/login` with `?redirectTo=`
- Authenticated users hitting `/auth/*` redirect to `/dashboard`
- **`/demo` is public** — full dashboard UI preview with static mock data only

### API & billing

- Stripe webhook signature verification on every `POST /api/webhooks/stripe` request
- Missing or invalid `stripe-signature` returns `400` without processing the body
- Checkout route verifies organization membership before creating a session
- Zod validation on auth-related form schemas (`src/lib/validations.ts`)

### Server-side secrets

- `SUPABASE_SERVICE_ROLE_KEY` is only used in server-only modules (`src/lib/supabase/server.ts`)
- Never expose service role or Stripe secret keys in `NEXT_PUBLIC_*` variables

### HTTP headers

Set in `next.config.ts` for all routes:

| Header                   | Value                                      |
| ------------------------ | ------------------------------------------ |
| `X-Frame-Options`        | `DENY`                                     |
| `X-Content-Type-Options` | `nosniff`                                  |
| `Referrer-Policy`        | `strict-origin-when-cross-origin`          |
| `Permissions-Policy`     | `camera=(), microphone=(), geolocation=()` |

### Access control

- Role model: `SUPER_ADMIN`, `ADMIN`, `MEMBER` on `OrganizationMember`
- Server helpers (`requireAuth`, `getOrganizationMembership`) enforce auth in dashboard layouts and API handlers

## Deployment Checklist

When you deploy LaunchKit for production:

1. **Never commit** `.env.local` or production secrets to git
2. Use **separate** Supabase and Stripe projects for development and production
3. **Rotate** `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_SECRET` if they may have leaked
4. Register production URLs in Supabase **Authentication → URL Configuration** (including `/api/auth/callback`)
5. Point Stripe webhooks to `https://your-domain.com/api/webhooks/stripe` and use the production signing secret
6. Enable **Row Level Security (RLS)** on Supabase tables if clients access the database directly
7. Run `npm audit` regularly and keep dependencies updated
8. Set `NEXT_PUBLIC_SHOW_DEVELOPER_CREDIT=false` if you do not want the default developer attribution in the UI

## Sensitive Environment Variables

| Variable                             | Exposure    | Notes                                                              |
| ------------------------------------ | ----------- | ------------------------------------------------------------------ |
| `SUPABASE_SERVICE_ROLE_KEY`          | Server only | Full database access — treat like a root password                  |
| `STRIPE_SECRET_KEY`                  | Server only | Can charge customers and manage subscriptions                      |
| `STRIPE_WEBHOOK_SECRET`              | Server only | Prevents forged webhook events                                     |
| `DATABASE_URL` / `DIRECT_URL`        | Server only | Direct Postgres access                                             |
| `RESEND_API_KEY`                     | Server only | Can send email from your domain                                    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`      | Public      | Safe for browser with RLS; still scope Supabase policies correctly |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public      | Expected to be public                                              |

## Supply chain & build provenance

CI and release workflows generate **SLSA build provenance** attestations for `launchkit-build.tar.gz` using [`actions/attest-build-provenance`](https://github.com/actions/attest-build-provenance). Signatures are issued via Sigstore and stored in GitHub’s attestations API.

Verify downloaded release artifacts before deploying:

```bash
gh attestation verify launchkit-build.tar.gz --owner OmarSharaf --repo launchkit
```

See [docs/CI_CD.md](./docs/CI_CD.md#build-provenance-attestations) for details.

## Testing vs. security

The project enforces **100% Jest code coverage** on `src/`. That improves regression safety but is **not** a substitute for security review, penetration testing, or threat modeling of your deployment.
