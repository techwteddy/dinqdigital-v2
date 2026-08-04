'use client'

import { useState, type FormEvent } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const REQUEST_TYPES = [
  'Bug Fix',
  'New Feature',
  'Content Update',
  'Design Change',
] as const

type ServiceRequestFormProps = {
  formId: string
  orgId: string
  email: string
}

export function ServiceRequestForm({
  formId,
  orgId,
  email,
}: ServiceRequestFormProps) {
  const [requestType, setRequestType] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle'
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')

    try {
      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: formId,
          submissionData: [
            { field: 'request-type', value: requestType },
            { field: 'description', value: description },
            { field: 'org-id', value: orgId },
            { field: 'email', value: email },
          ],
        }),
      })

      if (!response.ok) throw new Error('Failed to submit')

      setRequestType('')
      setDescription('')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">New request</CardTitle>
        <CardDescription>
          Tell us what you need — bugs, features, content, or design changes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <label htmlFor="request-type" className="text-sm font-medium">
              Request Type
            </label>
            <select
              id="request-type"
              required
              value={requestType}
              onChange={(event) => setRequestType(event.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="" disabled>
                Select a request type
              </option>
              {REQUEST_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Describe what you need…"
            />
          </div>

          {status === 'error' && (
            <p className="text-sm text-destructive">
              Something went wrong. Please try again.
            </p>
          )}
          {status === 'success' && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              Request submitted. We&apos;ll follow up soon.
            </p>
          )}

          <Button type="submit" disabled={status === 'submitting'} className="w-fit">
            {status === 'submitting' && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Submit request
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
