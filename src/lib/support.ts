export type SupportStatus = 'open' | 'in_progress' | 'resolved'
export type SupportPriority = 'low' | 'medium' | 'high' | 'urgent'
export type SupportCategory =
  | 'general'
  | 'bug'
  | 'feature'
  | 'billing'
  | 'design'
  | 'content'

export type SupportTicketItem = {
  id: string
  orgId: string
  clientEmail: string
  title: string
  description: string
  status: SupportStatus | string
  priority: SupportPriority | string
  category: SupportCategory | string
  createdAt: string
  updatedAt: string
}

export const SUPPORT_STATUS_LABELS: Record<SupportStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
}

export const SUPPORT_PRIORITY_LABELS: Record<SupportPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

export const SUPPORT_CATEGORY_LABELS: Record<SupportCategory, string> = {
  general: 'General',
  bug: 'Bug Report',
  feature: 'Feature Request',
  billing: 'Billing',
  design: 'Design',
  content: 'Content',
}

export function formatSupportDate(date?: string | null): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function supportPriorityVariant(
  priority: string
): 'secondary' | 'default' | 'outline' | 'success' {
  switch (priority) {
    case 'urgent':
    case 'high':
      return 'default'
    case 'low':
      return 'outline'
    default:
      return 'secondary'
  }
}

export function supportStatusClass(status: string): string {
  switch (status) {
    case 'open':
      return 'border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400'
    case 'in_progress':
      return 'border-transparent bg-sky-500/15 text-sky-700 dark:text-sky-400'
    case 'resolved':
      return 'border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
    default:
      return ''
  }
}

export function supportStatusLabel(status: string): string {
  return (
    SUPPORT_STATUS_LABELS[status as SupportStatus] ??
    status.replaceAll('_', ' ')
  )
}
