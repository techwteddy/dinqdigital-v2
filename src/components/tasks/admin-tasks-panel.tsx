'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  formatTaskDueDate,
  priorityVariant,
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  type TaskItem,
  type TaskPriority,
  type TaskStatus,
} from '@/lib/tasks'

type OrgOption = {
  id: string
  name: string
}

type TaskFormState = {
  orgId: string
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  dueDate: string
}

const EMPTY_FORM: TaskFormState = {
  orgId: '',
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
  dueDate: '',
}

const FILTERS: Array<{ key: 'all' | TaskStatus; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'todo', label: 'Todo' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
]

function toDateInputValue(date?: string | null) {
  if (!date) return ''
  return new Date(date).toISOString().slice(0, 10)
}

function toIsoDate(date: string) {
  if (!date) return null
  return new Date(`${date}T12:00:00.000Z`).toISOString()
}

type AdminTasksPanelProps = {
  organizations: OrgOption[]
}

export function AdminTasksPanel({ organizations }: AdminTasksPanelProps) {
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [filter, setFilter] = useState<'all' | TaskStatus>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<TaskItem | null>(null)
  const [form, setForm] = useState<TaskFormState>(EMPTY_FORM)

  const orgNameById = useMemo(
    () => new Map(organizations.map((org) => [org.id, org.name])),
    [organizations]
  )

  const loadTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const query =
        filter === 'all' ? '/api/tasks' : `/api/tasks?status=${filter}`
      const response = await fetch(query)
      if (!response.ok) throw new Error('Failed to load tasks')
      const data = (await response.json()) as { tasks: TaskItem[] }
      setTasks(data.tasks)
    } catch {
      setError('Could not load tasks.')
      setTasks([])
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    void loadTasks()
  }, [loadTasks])

  const orgOptions = organizations

  function openCreate() {
    setEditing(null)
    setForm({
      ...EMPTY_FORM,
      orgId: orgOptions[0]?.id ?? '',
    })
    setOpen(true)
  }

  function openEdit(task: TaskItem) {
    setEditing(task)
    setForm({
      orgId: task.orgId,
      title: task.title,
      description: task.description ?? '',
      priority: (task.priority as TaskPriority) || 'medium',
      status: (task.status as TaskStatus) || 'todo',
      dueDate: toDateInputValue(task.dueDate),
    })
    setOpen(true)
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)

    try {
      if (editing) {
        const response = await fetch(`/api/tasks/${editing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: form.title,
            description: form.description || null,
            priority: form.priority,
            status: form.status,
            dueDate: toIsoDate(form.dueDate),
          }),
        })
        if (!response.ok) throw new Error('Failed to update task')
      } else {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orgId: form.orgId,
            title: form.title,
            description: form.description || null,
            priority: form.priority,
            status: form.status,
            dueDate: toIsoDate(form.dueDate),
          }),
        })
        if (!response.ok) throw new Error('Failed to create task')
      }

      setOpen(false)
      await loadTasks()
    } catch {
      setError(editing ? 'Could not update task.' : 'Could not create task.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(task: TaskItem) {
    if (!window.confirm(`Delete task "${task.title}"?`)) return
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete task')
      await loadTasks()
    } catch {
      setError('Could not delete task.')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <Button
              key={item.key}
              type="button"
              size="sm"
              variant={filter === item.key ? 'default' : 'outline'}
              onClick={() => setFilter(item.key)}
            >
              {item.label}
            </Button>
          ))}
        </div>
        <Button type="button" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 sm:px-5">Client</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Due Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right sm:px-5"> </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading tasks…
                  </span>
                </td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No tasks yet.
                </td>
              </tr>
            ) : (
              tasks.map((task) => {
                const priority = (task.priority || 'medium') as TaskPriority
                const status = (task.status || 'todo') as TaskStatus
                return (
                  <tr
                    key={task.id}
                    className="transition-colors hover:bg-muted/20"
                  >
                    <td className="px-4 py-3.5 sm:px-5">
                      <p className="font-medium">
                        {orgNameById.get(task.orgId) ?? 'Client'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {task.orgId}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium">{task.title}</p>
                      {task.description && (
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {task.description}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={priorityVariant(priority)}>
                        {TASK_PRIORITY_LABELS[priority] ?? task.priority}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {formatTaskDueDate(task.dueDate)}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        variant={status === 'done' ? 'success' : 'secondary'}
                      >
                        {TASK_STATUS_LABELS[status] ?? task.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right sm:px-5">
                      <div className="inline-flex gap-1">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => openEdit(task)}
                          aria-label="Edit task"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => void handleDelete(task)}
                          aria-label="Delete task"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit task' : 'Add Task'}</DialogTitle>
            <DialogDescription>
              {editing
                ? 'Update task details for this client.'
                : 'Assign a new task and notify the client organization.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4">
            {!editing && (
              <div className="space-y-2">
                <label htmlFor="orgId" className="text-sm font-medium">
                  Client organization
                </label>
                <select
                  id="orgId"
                  required
                  value={form.orgId}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      orgId: event.target.value,
                    }))
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="" disabled>
                    Select organization
                  </option>
                  {orgOptions.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name} ({org.id})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                required
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </label>
                <select
                  id="priority"
                  value={form.priority}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      priority: event.target.value as TaskPriority,
                    }))
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {Object.entries(TASK_PRIORITY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value as TaskStatus,
                    }))
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-medium">
                Due date
              </label>
              <Input
                id="dueDate"
                type="date"
                value={form.dueDate}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    dueDate: event.target.value,
                  }))
                }
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving || !form.title.trim()}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editing ? 'Save changes' : 'Create task'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
