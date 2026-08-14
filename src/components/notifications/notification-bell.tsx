'use client'

import { useCallback, useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

type NotificationItem = {
  id: string
  title: string
  body: string
  type: string
  isRead: boolean
  createdAt: string
}

function formatTimeAgo(date: string): string {
  const then = new Date(date).getTime()
  const now = Date.now()
  const diffSecs = Math.max(0, Math.floor((now - then) / 1000))
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'just now'
  if (diffMins === 1) return '1 minute ago'
  if (diffMins < 60) return `${diffMins} minutes ago`
  if (diffHours === 1) return '1 hour ago'
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`

  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const loadNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications')
      if (!response.ok) return
      const data = (await response.json()) as {
        notifications: NotificationItem[]
        unreadCount: number
      }
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
    } catch {
      // Keep the last known list if polling fails.
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadNotifications()
    const interval = window.setInterval(() => {
      void loadNotifications()
    }, 30_000)
    return () => window.clearInterval(interval)
  }, [loadNotifications])

  async function markAsRead(id: string) {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, isRead: true } : item
      )
    )
    setUnreadCount((count) => Math.max(0, count - 1))

    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
      })
      if (!response.ok) throw new Error('Failed to mark as read')
      await loadNotifications()
    } catch {
      await loadNotifications()
    }
  }

  async function markAllAsRead() {
    setNotifications((current) =>
      current.map((item) => ({ ...item, isRead: true }))
    )
    setUnreadCount(0)

    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'PATCH',
      })
      if (!response.ok) throw new Error('Failed to mark all as read')
      await loadNotifications()
    } catch {
      await loadNotifications()
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="default"
              className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white hover:bg-red-600"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 border-border bg-card p-0 shadow-lg"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-auto px-2 py-1 text-xs"
            disabled={unreadCount === 0}
            onClick={() => void markAllAsRead()}
          >
            Mark all as read
          </Button>
        </div>

        <ScrollArea className="h-80">
          {loading ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              Loading…
            </p>
          ) : notifications.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              No notifications yet
            </p>
          ) : (
            <ul>
              {notifications.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => void markAsRead(item.id)}
                    className={cn(
                      'flex w-full gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-0 hover:bg-muted/40',
                      !item.isRead && 'bg-primary/5'
                    )}
                  >
                    <span
                      className={cn(
                        'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                        item.isRead ? 'bg-transparent' : 'bg-primary'
                      )}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          'block text-sm',
                          item.isRead ? 'font-normal' : 'font-bold'
                        )}
                      >
                        {item.title}
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">
                        {item.body}
                      </span>
                      <span className="mt-1 block text-[11px] text-muted-foreground">
                        {formatTimeAgo(item.createdAt)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
