# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | ✅ Yes     |

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

If you discover a security vulnerability, please email:

📧 **omar@omarsharaf.me**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

You can expect a response within **48 hours** and a patch within **7 days** for critical issues.

We take security seriously and appreciate responsible disclosure. Contributors who report valid vulnerabilities will be credited in the release notes.

## Security Best Practices for Users

When deploying LaunchKit:

1. **Never commit `.env.local`** — it's in `.gitignore` but double-check
2. **Rotate secrets regularly** — especially `SUPABASE_SERVICE_ROLE_KEY` and `STRIPE_SECRET_KEY`
3. **Use environment-specific keys** — separate test/production Stripe and Supabase projects
4. **Enable Supabase Row Level Security (RLS)** for any direct database access
5. **Review Stripe webhook signatures** — the webhook handler verifies all events
6. **Keep dependencies updated** — run `npm audit` regularly

## Known Security Measures in LaunchKit

- ✅ Stripe webhook signature verification on every event
- ✅ Supabase JWT verification via `supabase.auth.getUser()` (not `getSession()`)
- ✅ Admin client (`SUPABASE_SERVICE_ROLE_KEY`) only used server-side
- ✅ Security headers: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`
- ✅ Role-based access control checked server-side on all protected API routes
- ✅ Zod input validation on all API route handlers
- ✅ CSRF protection via Next.js App Router Server Actions
