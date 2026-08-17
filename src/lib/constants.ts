export const TED_ADMIN_EMAIL = 'techwithteddy@gmail.com'

export function isTedAdmin(email?: string | null): boolean {
  return email === TED_ADMIN_EMAIL
}

export function getHomePathForUser(email?: string | null): string {
  return isTedAdmin(email) ? '/admin' : '/dashboard'
}

export function formatPlanLabel(plan?: string | null): string {
  switch (plan) {
    case '500':
      return '$500'
    case '1200':
      return '$1,200'
    case 'custom':
      return 'Custom'
    default:
      return plan?.trim() || '—'
  }
}
