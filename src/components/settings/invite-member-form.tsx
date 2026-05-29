'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { inviteMemberSchema, type InviteMemberInput } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function InviteMemberForm({
  organizationId,
}: {
  organizationId: string
}) {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteMemberInput>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: { role: 'MEMBER' },
  })

  async function onSubmit(data: InviteMemberInput) {
    setError(null)
    setSuccess(false)

    const response = await fetch(
      `/api/organizations/${organizationId}/invite`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    )

    const result = await response.json()

    if (!response.ok) {
      setError(
        typeof result.error === 'string' ? result.error : 'Invite failed'
      )
      return
    }

    setSuccess(true)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-400">
          Invitation sent successfully.
        </div>
      )}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1 space-y-2">
          <label htmlFor="invite-email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="invite-email"
            type="email"
            placeholder="teammate@company.com"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2 sm:w-36">
          <label htmlFor="invite-role" className="text-sm font-medium">
            Role
          </label>
          <select
            id="invite-role"
            {...register('role')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Send invitation
      </Button>
    </form>
  )
}
