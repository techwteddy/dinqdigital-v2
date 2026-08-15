'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { CheckSquare, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  formatTaskDueDate,
  priorityVariant,
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  type TaskItem,
  type TaskPriority,
  type TaskStatus,
} from '@/lib/tasks'
import { cn } from '@/lib/utils'

const COLUMNS: TaskStatus[] = ['todo', 'in_progress', 'done']

type ClientTasksPanelProps = {
  orgId: string
}

export function ClientTasksPanel({ orgId }: ClientTasksPanelProps) {
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const loadTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `/api/tasks?orgId=${encodeURIComponent(orgId)}`
      )
      if (!response.ok) throw new Error('Failed to load tasks')
      const data = (await response.json()) as { tasks: TaskItem[] }
      setTasks(data.tasks)
    } catch {
      setError('Could not load tasks.')
      setTasks([])
    } finally {
      setLoading(false)
    }
  }, [orgId])

  useEffect(() => {
    void loadTasks()
  }, [loadTasks])

  const columns = useMemo(
    () =>
      COLUMNS.map((status) => ({
        status,
        label: TASK_STATUS_LABELS[status],
        tasks: tasks.filter((task) => task.status === status),
      })),
    [tasks]
  )

  async function toggleComplete(task: TaskItem) {
    const nextStatus: TaskStatus = task.status === 'done' ? 'todo' : 'done'
    setUpdatingId(task.id)
    setTasks((current) =>
      current.map((item) =>
        item.id === task.id ? { ...item, status: nextStatus } : item
      )
    )

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (!response.ok) throw new Error('Failed to update task')
    } catch {
      setError('Could not update task.')
      await loadTasks()
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-center gap-2 py-14 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading tasks…
        </CardContent>
      </Card>
    )
  }

  if (tasks.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center py-14 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <CheckSquare className="h-7 w-7 text-primary" />
          </div>
          <p className="text-base font-semibold">No tasks yet</p>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            When Ted assigns work to your project, it will show up here.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {columns.map((column) => (
          <div key={column.status} className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold">{column.label}</h2>
              <Badge variant="secondary">{column.tasks.length}</Badge>
            </div>
            <div className="flex min-h-[180px] flex-col gap-3 rounded-xl border border-border bg-muted/20 p-3">
              {column.tasks.length === 0 ? (
                <p className="px-1 py-8 text-center text-xs text-muted-foreground">
                  No tasks
                </p>
              ) : (
                column.tasks.map((task) => {
                  const priority = (task.priority ||
                    'medium') as TaskPriority
                  return (
                    <Card
                      key={task.id}
                      className={cn(
                        'transition-all hover:border-primary/20',
                        task.status === 'done' && 'opacity-80'
                      )}
                    >
                      <CardHeader className="flex flex-row items-start gap-3 space-y-0 p-4 pb-2">
                        <Checkbox
                          checked={task.status === 'done'}
                          disabled={updatingId === task.id}
                          onCheckedChange={() => void toggleComplete(task)}
                          aria-label={`Mark ${task.title} complete`}
                          className="mt-1"
                        />
                        <div className="min-w-0 flex-1 space-y-2">
                          <CardTitle
                            className={cn(
                              'text-base',
                              task.status === 'done' &&
                                'text-muted-foreground line-through'
                            )}
                          >
                            {task.title}
                          </CardTitle>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={priorityVariant(priority)}>
                              {TASK_PRIORITY_LABELS[priority] ?? task.priority}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatTaskDueDate(task.dueDate)}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      {task.description && (
                        <CardContent className="px-4 pb-4 pt-0">
                          <p className="line-clamp-2 pl-7 text-xs text-muted-foreground">
                            {task.description}
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  )
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
