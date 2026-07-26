'use client'

import { useEffect, useId, useState, type FormEvent } from 'react'
import { Loader2, X } from 'lucide-react'

const BUDGET_OPTIONS = [
  { label: '$500 - Starter Website', value: '$500' },
  { label: '$1,200 - Pro Website', value: '$1,200' },
  { label: 'Custom - Enterprise/AI', value: 'Custom' },
] as const

type QuoteFormState = {
  fullName: string
  email: string
  companyName: string
  budgetTier: string
  projectDescription: string
}

type QuoteModalProps = {
  open: boolean
  onClose: () => void
}

let cachedFormId: string | null = null

async function resolveQuoteFormId(): Promise<string> {
  if (cachedFormId) return cachedFormId

  try {
    const response = await fetch(
      '/api/forms?where[title][equals]=Start%20a%20Project&limit=1'
    )
    if (response.ok) {
      const data = (await response.json()) as {
        docs?: Array<{ id?: string | number }>
      }
      const id = data.docs?.[0]?.id
      if (id != null) {
        cachedFormId = String(id)
        return cachedFormId
      }
    }
  } catch {
    // Fall through to env/default — forms list can fail while submissions still work.
  }

  cachedFormId = process.env.NEXT_PUBLIC_PAYLOAD_QUOTE_FORM_ID ?? '1'
  return cachedFormId
}

export function QuoteModal({ open, onClose }: QuoteModalProps) {
  const titleId = useId()
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle'
  )
  const [formData, setFormData] = useState<QuoteFormState>({
    fullName: '',
    email: '',
    companyName: '',
    budgetTier: '',
    projectDescription: '',
  })

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) {
      setStatus('idle')
      setFormData({
        fullName: '',
        email: '',
        companyName: '',
        budgetTier: '',
        projectDescription: '',
      })
    }
  }, [open])

  if (!open) return null

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')

    try {
      const formId = await resolveQuoteFormId()
      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: formId,
          submissionData: [
            { field: 'full-name', value: formData.fullName },
            { field: 'email', value: formData.email },
            { field: 'company-name', value: formData.companyName },
            { field: 'budget-tier', value: formData.budgetTier },
            {
              field: 'project-description',
              value: formData.projectDescription,
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          aria-label="Close quote form"
        >
          <X className="h-5 w-5" />
        </button>

        {status === 'success' ? (
          <div className="py-10 text-center">
            <h2 id={titleId} className="text-2xl font-bold text-slate-900">
              Thank you!
            </h2>
            <p className="mt-3 text-slate-600">
              We&apos;ll be in touch within 24 hours.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-8 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 id={titleId} className="pr-10 text-2xl font-bold text-slate-900">
              Start a Project
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Tell us about your project and we&apos;ll get back to you within
              24 hours.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-800">
                Full Name
                <input
                  required
                  type="text"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      fullName: event.target.value,
                    }))
                  }
                  className="h-11 rounded-md border border-slate-300 px-3 text-sm text-slate-900 outline-none ring-blue-600 focus:ring-2"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-800">
                Email
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  className="h-11 rounded-md border border-slate-300 px-3 text-sm text-slate-900 outline-none ring-blue-600 focus:ring-2"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-800">
                Company Name
                <input
                  type="text"
                  autoComplete="organization"
                  value={formData.companyName}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      companyName: event.target.value,
                    }))
                  }
                  className="h-11 rounded-md border border-slate-300 px-3 text-sm text-slate-900 outline-none ring-blue-600 focus:ring-2"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-800">
                Budget Tier
                <select
                  required
                  value={formData.budgetTier}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      budgetTier: event.target.value,
                    }))
                  }
                  className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none ring-blue-600 focus:ring-2"
                >
                  <option value="" disabled>
                    Select a budget tier
                  </option>
                  {BUDGET_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-800">
                Project Description
                <textarea
                  required
                  rows={4}
                  value={formData.projectDescription}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      projectDescription: event.target.value,
                    }))
                  }
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-blue-600 focus:ring-2"
                />
              </label>

              {status === 'error' && (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                  Something went wrong. Please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="mt-2 flex h-11 items-center justify-center gap-2 rounded-md bg-blue-600 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
              >
                {status === 'submitting' && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Send My Project Details
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
