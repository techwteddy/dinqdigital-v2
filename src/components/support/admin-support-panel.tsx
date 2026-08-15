'use client'

import { useCallback, useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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

const FILTERS: Array<{ key: 'all' | SupportStatus; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved' },
]

export function AdminSupportPanel() {
  const [tickets, setTickets] = useState<SupportTicketItem[]>([])
  const [filter, setFilter] = useState<'all' | SupportStatus>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<SupportTicketItem | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const loadTickets = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const query =
        filter === 'all' ? '/api/support' : `/api/support?status=${filter}`
      const response = await fetch(query)
      if (!response.ok) throw new Error('Failed to load tickets')
      const data = (await response.json()) as { tickets: SupportTicketItem[] }
      setTickets(data.tickets)
    } catch {
      setError('Could not load support tickets.')
      setTickets([])
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    void loadTickets()
  }, [loadTickets])

  async function updateStatus(ticket: SupportTicketItem, status: SupportStatus) {
    if (ticket.status === status) return
    setUpdatingId(ticket.id)
    setError(null)

    setTickets((current) =>
      current.map((item) =>
        item.id === ticket.id ? { ...item, status } : item
      )
    )
    setSelected((current) =>
      current?.id === ticket.id ? { ...current, status } : current
    )

    try {
      const response = await fetch(`/api/support/${ticket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) throw new Error('Failed to update ticket')
      if (filter !== 'all' && filter !== status) {
        await loadTickets()
      }
    } catch {
      setError('Could not update ticket status.')
      await loadTickets()
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
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

      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Client</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-muted-foreground"
                >
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading tickets…
                  </span>
                </TableCell>
              </TableRow>
            ) : tickets.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-muted-foreground"
                >
                  No support tickets yet.
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => {
                const status = (ticket.status || 'open') as SupportStatus
                const priority = (ticket.priority ||
                  'medium') as SupportPriority
                const category = (ticket.category ||
                  'general') as SupportCategory
                return (
                  <TableRow
                    key={ticket.id}
                    className="cursor-pointer"
                    onClick={() => setSelected(ticket)}
                  >
                    <TableCell>
                      <p className="font-medium">{ticket.clientEmail}</p>
                      <p className="text-xs text-muted-foreground">
                        {ticket.orgId}
                      </p>
                    </TableCell>
                    <TableCell className="font-medium">{ticket.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {SUPPORT_CATEGORY_LABELS[category] ?? ticket.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={supportPriorityVariant(priority)}>
                        {SUPPORT_PRIORITY_LABELS[priority] ?? ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={(event) => event.stopPropagation()}>
                      <Select
                        value={status}
                        disabled={updatingId === ticket.id}
                        onValueChange={(value) =>
                          void updateStatus(ticket, value as SupportStatus)
                        }
                      >
                        <SelectTrigger className="h-8 w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(SUPPORT_STATUS_LABELS).map(
                            ([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatSupportDate(ticket.createdAt)}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(next) => {
          if (!next) setSelected(null)
        }}
      >
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.title}</DialogTitle>
                <DialogDescription>
                  {selected.clientEmail} ·{' '}
                  {formatSupportDate(selected.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {SUPPORT_CATEGORY_LABELS[
                    (selected.category || 'general') as SupportCategory
                  ] ?? selected.category}
                </Badge>
                <Badge
                  variant={supportPriorityVariant(selected.priority || 'medium')}
                >
                  {SUPPORT_PRIORITY_LABELS[
                    (selected.priority || 'medium') as SupportPriority
                  ] ?? selected.priority}
                </Badge>
                <Badge
                  className={cn(supportStatusClass(selected.status || 'open'))}
                  variant="outline"
                >
                  {SUPPORT_STATUS_LABELS[
                    (selected.status || 'open') as SupportStatus
                  ] ?? selected.status}
                </Badge>
              </div>

              <div className="rounded-md border border-border bg-muted/20 p-4 text-sm whitespace-pre-wrap">
                {selected.description}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={(selected.status || 'open') as SupportStatus}
                  disabled={updatingId === selected.id}
                  onValueChange={(value) =>
                    void updateStatus(selected, value as SupportStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SUPPORT_STATUS_LABELS).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
