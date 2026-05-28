import type {
  User,
  Organization,
  OrganizationMember,
  Subscription,
  Plan,
  Invitation,
  AuditLog,
  UserRole,
  SubscriptionStatus,
} from '@prisma/client'

// ─────────────────────────────────────────────
// RE-EXPORTS
// ─────────────────────────────────────────────
export type {
  User,
  Organization,
  OrganizationMember,
  Subscription,
  Plan,
  Invitation,
  AuditLog,
  UserRole,
  SubscriptionStatus,
}

// ─────────────────────────────────────────────
// COMPOSED TYPES
// ─────────────────────────────────────────────

export type OrganizationWithSubscription = Organization & {
  subscription:
    | (Subscription & {
        plan: Plan
      })
    | null
}

export type MembershipWithOrg = OrganizationMember & {
  organization: OrganizationWithSubscription
}

export type MemberWithUser = OrganizationMember & {
  user: User
}

// ─────────────────────────────────────────────
// API RESPONSE TYPES
// ─────────────────────────────────────────────

export type ApiResponse<T = null> =
  | { success: true; data: T }
  | { success: false; error: string }

// ─────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────

export interface NavItem {
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string | number
  disabled?: boolean
  external?: boolean
}

export interface NavSection {
  title?: string
  items: NavItem[]
}

// ─────────────────────────────────────────────
// MISC
// ─────────────────────────────────────────────

export type ColorScheme = 'light' | 'dark' | 'system'
