'use client'

/** Sends a password reset email via Supabase — same UX pattern as RegisterForm success state. */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from '@/lib/validations'

export function ForgotPasswordForm() {
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const supabase = createClient()

  async function onSubmit(data: ForgotPasswordInput) {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      setError('root', { message: error.message })
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <div className="mb-3 text-4xl">📬</div>
        <h2 className="mb-2 font-semibold">Reset link sent</h2>
        <p className="text-sm text-muted-foreground">
          If an account with that email exists, you&apos;ll receive a password
          reset link shortly.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-3"
    >
      {errors.root && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {errors.root.message}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register('email')}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Send reset link
      </button>
    </form>
  )
}
