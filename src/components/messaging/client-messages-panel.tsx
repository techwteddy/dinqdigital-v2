'use client'

import { useCallback, useEffect, useState } from 'react'
import { Loader2, MessageSquare, Plus, Send } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatRelativeDate, cn } from '@/lib/utils'

type MessageItem = {
  id: string
  senderEmail: string
  senderName: string
  body: string
  createdAt: string
  isRead: boolean
}

type ConversationItem = {
  id: string
  orgId: string
  clientEmail: string
  subject: string | null
  updatedAt: string
  lastMessage: MessageItem | null
  unreadCount: number
}

type ClientMessagesPanelProps = {
  orgId: string
  userEmail: string
  userName: string
}

function initials(name: string) {
  return (
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?'
  )
}

export function ClientMessagesPanel({
  orgId,
  userEmail,
  userName,
}: ClientMessagesPanelProps) {
  const [conversations, setConversations] = useState<ConversationItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [loadingThread, setLoadingThread] = useState(false)
  const [reply, setReply] = useState('')
  const [subject, setSubject] = useState('')
  const [newBody, setNewBody] = useState('')
  const [creating, setCreating] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selected = conversations.find((item) => item.id === selectedId) ?? null

  const loadConversations = useCallback(async () => {
    setLoadingList(true)
    setError(null)
    try {
      const response = await fetch(
        `/api/conversations?orgId=${encodeURIComponent(orgId)}`
      )
      if (!response.ok) throw new Error('Failed to load conversations')
      const data = (await response.json()) as {
        conversations: ConversationItem[]
      }
      setConversations(data.conversations)
      if (!selectedId && data.conversations[0]) {
        setSelectedId(data.conversations[0].id)
      }
    } catch {
      setError('Could not load conversations.')
    } finally {
      setLoadingList(false)
    }
  }, [orgId, selectedId])

  const loadMessages = useCallback(async (conversationId: string) => {
    setLoadingThread(true)
    setError(null)
    try {
      const response = await fetch(
        `/api/conversations/${conversationId}/messages`
      )
      if (!response.ok) throw new Error('Failed to load messages')
      const data = (await response.json()) as { messages: MessageItem[] }
      setMessages(data.messages)
      setConversations((current) =>
        current.map((item) =>
          item.id === conversationId ? { ...item, unreadCount: 0 } : item
        )
      )
    } catch {
      setError('Could not load messages.')
      setMessages([])
    } finally {
      setLoadingThread(false)
    }
  }, [])

  useEffect(() => {
    void loadConversations()
  }, [orgId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedId) void loadMessages(selectedId)
  }, [selectedId, loadMessages])

  async function handleCreateConversation(event: React.FormEvent) {
    event.preventDefault()
    setCreating(true)
    setError(null)
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId,
          subject,
          body: newBody,
        }),
      })
      if (!response.ok) throw new Error('Failed to create conversation')
      const data = (await response.json()) as {
        conversation: ConversationItem & { messages: MessageItem[] }
      }
      setSubject('')
      setNewBody('')
      setShowNew(false)
      setSelectedId(data.conversation.id)
      await loadConversations()
    } catch {
      setError('Could not start conversation.')
    } finally {
      setCreating(false)
    }
  }

  async function handleReply(event: React.FormEvent) {
    event.preventDefault()
    if (!selectedId || !reply.trim()) return
    setSending(true)
    setError(null)
    try {
      const response = await fetch(
        `/api/conversations/${selectedId}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ body: reply.trim() }),
        }
      )
      if (!response.ok) throw new Error('Failed to send message')
      setReply('')
      await loadMessages(selectedId)
      await loadConversations()
    } catch {
      setError('Could not send message.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Message Ted about your project updates, questions, and requests.
        </p>
        <Button
          type="button"
          size="sm"
          onClick={() => setShowNew((value) => !value)}
        >
          <Plus className="h-4 w-4" />
          New conversation
        </Button>
      </div>

      {showNew && (
        <Card>
          <CardContent className="space-y-3 p-4">
            <form onSubmit={handleCreateConversation} className="space-y-3">
              <Input
                required
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Subject"
              />
              <textarea
                required
                value={newBody}
                onChange={(event) => setNewBody(event.target.value)}
                placeholder="Write your message…"
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={creating}>
                  {creating && <Loader2 className="h-4 w-4 animate-spin" />}
                  Start conversation
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNew(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid min-h-[560px] overflow-hidden rounded-xl border border-border bg-card lg:grid-cols-[320px_1fr]">
        <div className="border-b border-border lg:border-b-0 lg:border-r">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold">Conversations</h2>
          </div>
          <ScrollArea className="h-[240px] lg:h-[520px]">
            {loadingList ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                Loading…
              </p>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No conversations yet. Start one to message Ted.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {conversations.map((conversation) => (
                  <li key={conversation.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(conversation.id)}
                      className={cn(
                        'flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors hover:bg-muted/40',
                        selectedId === conversation.id && 'bg-primary/5'
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium">
                          {conversation.subject || 'Untitled'}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="default">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {conversation.lastMessage?.body || 'No messages yet'}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatRelativeDate(conversation.updatedAt)}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </div>

        <div className="flex min-h-[320px] flex-col">
          {!selected ? (
            <div className="flex flex-1 items-center justify-center p-8 text-sm text-muted-foreground">
              Select a conversation to view messages.
            </div>
          ) : (
            <>
              <div className="border-b border-border px-4 py-3">
                <h2 className="text-sm font-semibold">
                  {selected.subject || 'Untitled'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Conversation with Ted
                </p>
              </div>

              <ScrollArea className="flex-1 px-4 py-4">
                {loadingThread ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Loading thread…
                  </p>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const mine = message.senderEmail === userEmail
                      return (
                        <div
                          key={message.id}
                          className={cn(
                            'flex gap-3',
                            mine ? 'flex-row-reverse' : 'flex-row'
                          )}
                        >
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>
                              {initials(
                                mine ? userName : message.senderName || 'Ted'
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={cn(
                              'max-w-[80%] rounded-xl border px-3 py-2',
                              mine
                                ? 'border-primary/20 bg-primary/10'
                                : 'border-border bg-muted/30'
                            )}
                          >
                            <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">
                                {message.senderName}
                              </span>
                              <span>
                                {formatRelativeDate(message.createdAt)}
                              </span>
                            </div>
                            <p className="whitespace-pre-wrap text-sm">
                              {message.body}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </ScrollArea>

              <form
                onSubmit={handleReply}
                className="flex gap-2 border-t border-border p-4"
              >
                <Input
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  placeholder="Write a reply…"
                  disabled={sending}
                />
                <Button type="submit" disabled={sending || !reply.trim()}>
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Send
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
