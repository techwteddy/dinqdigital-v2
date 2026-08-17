'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatPlanLabel, type ClientDoc } from '@/lib/admin'

const STATUS_VARIANT = {
  active: 'success',
  paused: 'secondary',
  completed: 'outline',
} as const

type PortalUserRow = {
  id: string
  email: string
  fullName: string
  createdAt: string
}

type AdminClientsTabsProps = {
  clients: ClientDoc[]
}

function formatJoinedDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function ClientsTable({ clients }: { clients: ClientDoc[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3 sm:px-5">Company Name</th>
            <th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Plan</th>
            <th className="px-4 py-3 sm:px-5">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {clients.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-10 text-center text-muted-foreground sm:px-5"
              >
                No clients yet. Add your first client to get started.
              </td>
            </tr>
          ) : (
            clients.map((client) => {
              const status = client.status ?? 'active'
              const variant =
                STATUS_VARIANT[status as keyof typeof STATUS_VARIANT] ??
                'secondary'

              return (
                <tr
                  key={String(client.id)}
                  className="transition-colors hover:bg-muted/20"
                >
                  <td className="px-4 py-3.5 font-medium sm:px-5">
                    {client.companyName || '—'}
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">
                    {client.contactName || '—'}
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">
                    {client.email || '—'}
                  </td>
                  <td className="px-4 py-3.5">
                    {formatPlanLabel(client.plan)}
                  </td>
                  <td className="px-4 py-3.5 sm:px-5">
                    <Badge variant={variant} className="capitalize">
                      {status}
                    </Badge>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

function PortalUsersPanel() {
  const [users, setUsers] = useState<PortalUserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/users')
      if (!response.ok) throw new Error('Failed to load users')
      const data = (await response.json()) as { users: PortalUserRow[] }
      setUsers(data.users)
    } catch {
      setError('Could not load portal users.')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadUsers()
  }, [loadUsers])

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-14 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading portal users…
      </div>
    )
  }

  if (error) {
    return (
      <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
        {error}
      </p>
    )
  }

  return (
    <div className="rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead>Email</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Joined Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="py-10 text-center text-muted-foreground"
              >
                No portal signups yet.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatJoinedDate(user.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild size="sm" variant="outline">
                    <Link
                      href={`/cms/collections/clients/create?email=${encodeURIComponent(user.email)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Create Client Record
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export function AdminClientsTabs({ clients }: AdminClientsTabsProps) {
  return (
    <Tabs defaultValue="clients">
      <TabsList>
        <TabsTrigger value="clients">Clients</TabsTrigger>
        <TabsTrigger value="portal-users">Portal Users</TabsTrigger>
      </TabsList>
      <TabsContent value="clients">
        <ClientsTable clients={clients} />
      </TabsContent>
      <TabsContent value="portal-users">
        <PortalUsersPanel />
      </TabsContent>
    </Tabs>
  )
}
