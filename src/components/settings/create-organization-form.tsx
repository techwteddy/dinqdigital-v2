'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import {
  createOrganizationSchema,
  type CreateOrganizationInput,
} from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { slugify } from '@/lib/utils'

export function CreateOrganizationForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrganizationInput>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: { name: '', slug: '' },
  })

  const name = watch('name')

  function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setValue('name', value)
    if (!watch('slug')) {
      setValue('slug', slugify(value))
    }
  }

  async function onSubmit(data: CreateOrganizationInput) {
    setError(null)

    const response = await fetch('/api/organizations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      setError(
        typeof result.error === 'string'
          ? result.error
          : 'Failed to create organization'
      )
      return
    }

    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <label htmlFor="org-name" className="text-sm font-medium">
          Organization name
        </label>
        <Input
          id="org-name"
          placeholder="Acme Inc."
          {...register('name')}
          onChange={onNameChange}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label htmlFor="org-slug" className="text-sm font-medium">
          URL slug
        </label>
        <Input id="org-slug" placeholder="acme-inc" {...register('slug')} />
        {errors.slug && (
          <p className="text-xs text-destructive">{errors.slug.message}</p>
        )}
        {name && (
          <p className="text-xs text-muted-foreground">
            Preview: {slugify(name) || 'your-slug'}
          </p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Create organization
      </Button>
    </form>
  )
}
