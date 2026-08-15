'use client'

import { useCallback, useEffect, useState } from 'react'
import { Loader2, LifeBuoy, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  formatSupportDate,
  SUPPORT_CATEGORY_LABELS,
  SUPPORT_PRIORITY_LABELS,
  SUPPORT_STATUS_LABELS,
  supportPriorityVariant,
  supportStatusClass,
  type SupportCategory,
  type SupportPriority,
  type SupportStatus,
  type SupportTicketItem,
} from '@/lib/support'
import { cn } from '@/lib/utils'

type TicketFormState = {
  title: string
  description: string
  category: SupportCategory
  priority: SupportPriority
}

const EMPTY_FORM: TicketFormState = {
  title: '',
  description: '',
  category: 'general_help',
  priority: 'medium',
}

type ClientSupportPanelProps = {
  orgId: string
}

export function ClientSupportPanel({ orgId }: ClientSupportPanelProps) {
  const [tickets, setTickets] = useState<SupportTicketItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<TicketFormState>(EMPTY_FORM)

  const loadTickets = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `/api/support?orgId=${encodeURIComponent(orgId)}`
      )
      if (!response.ok) throw new Error('Failed to load tickets')
      const data = (await response.json()) as { tickets: SupportTicketItem[] }
      setTickets(data.tickets)
    } catch {
      setError('Could not load support tickets.')
      setTickets([])
    } finally {
      setLoading(false)
    }
  }, [orgId])

  useEffect(() => {
    void loadTickets()
  }, [loadTickets])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId,
          title: form.title,
          description: form.description,
          category: form.category,
          priority: form.priority,
        }),
      })
      if (!response.ok) throw new Error('Failed to create ticket')
      setOpen(false)
      setForm(EMPTY_FORM)
      await loadTickets()
    } catch {
      setError('Could not create support ticket.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => {
            setForm(EMPTY_FORM)
            setOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          New Ticket
        </Button>
      </div>

      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {loading ? (
        <Card className="border-dashed">
          <CardContent className="flex items-center justify-center gap-2 py-14 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading tickets…
          </CardContent>
        </Card>
      ) : tickets.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center py-14 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <LifeBuoy className="h-7 w-7 text-primary" />
            </div>
            <p className="text-base font-semibold">No support tickets yet</p>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Open a ticket when you need help with your project, billing, or
              content.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {tickets.map((ticket) => {
            const status = (ticket.status || 'open') as SupportStatus
            const priority = (ticket.priority || 'medium') as SupportPriority
            const category = (ticket.category ||
              'general_help') as SupportCategory
            return (
              <Card key={ticket.id}>
                <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0 p-4 pb-2">
                  <CardTitle className="text-base">{ticket.title}</CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                      {SUPPORT_CATEGORY_LABELS[category] ?? ticket.category}
                    </Badge>
                    <Badge variant={supportPriorityVariant(priority)}>
                      {SUPPORT_PRIORITY_LABELS[priority] ?? ticket.priority}
                    </Badge>
                    <Badge
                      className={cn(supportStatusClass(status))}
                      variant="outline"
                    >
                      {SUPPORT_STATUS_LABELS[status] ?? ticket.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {ticket.description}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Created {formatSupportDate(ticket.createdAt)}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Ticket</DialogTitle>
            <DialogDescription>
              Tell Ted what you need help with. You will get a notification when
              the status changes.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={form.category}
                  onValueChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      category: value as SupportCategory,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SUPPORT_CATEGORY_LABELS).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={form.priority}
                  onValueChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      priority: value as SupportPriority,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SUPPORT_PRIORITY_LABELS).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                required
                rows={4}
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  saving || !form.title.trim() || !form.description.trim()
                }
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
