export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export type TaskItem = {
  id: string
  orgId: string
  projectId?: string | null
  title: string
  description?: string | null
  status: TaskStatus | string
  priority: TaskPriority | string
  dueDate?: string | null
  assignedTo?: string | null
  createdAt: string
  updatedAt: string
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
}

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

export function formatTaskDueDate(date?: string | null): string {
  if (!date) return 'No due date'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function priorityVariant(
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
