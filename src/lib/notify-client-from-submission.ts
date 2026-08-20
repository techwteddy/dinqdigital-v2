import type { Payload } from 'payload'
import { sendFormSubmissionEmail } from '@/lib/email'
import { logger } from '@/lib/logger'

type SubmissionDataItem = {
  field?: string | null
  value?: string | null
}

type FormSubmissionLike = {
  id?: string | number
  createdAt?: string
  form?: string | number | { id?: string | number; title?: string | null } | null
  submissionData?: SubmissionDataItem[] | null
}

type ClientLike = {
  orgId?: string | null
  dinqId?: string | null
  email?: string | null
  companyName?: string | null
  contactName?: string | null
}

function fieldValue(
  submission: FormSubmissionLike,
  fieldName: string
): string {
  const match = submission.submissionData?.find(
    (item) => item.field === fieldName
  )
  return match?.value?.trim() || ''
}

function buildMessage(submission: FormSubmissionLike): string {
  const requestType = fieldValue(submission, 'request-type')
  const description =
    fieldValue(submission, 'project-description') ||
    fieldValue(submission, 'description') ||
    fieldValue(submission, 'message')
  const company = fieldValue(submission, 'company-name')
  const budget = fieldValue(submission, 'budget-tier')

  const parts = [
    requestType && `Request: ${requestType}`,
    company && `Company: ${company}`,
    budget && `Budget: ${budget}`,
    description && description,
  ].filter(Boolean)

  return parts.join('\n') || 'New form submission received.'
}

async function resolveFormName(
  payload: Payload,
  submission: FormSubmissionLike
): Promise<string> {
  if (submission.form && typeof submission.form === 'object') {
    const title = submission.form.title?.trim()
    if (title) return title
  }

  const formId =
    typeof submission.form === 'object'
      ? submission.form?.id
      : submission.form

  if (formId == null) return 'Unknown form'

  try {
    const form = await payload.findByID({
      collection: 'forms',
      id: formId,
      depth: 0,
      overrideAccess: true,
    })
    return (form as { title?: string | null }).title?.trim() || String(formId)
  } catch {
    return String(formId)
  }
}

async function resolveDinqId(
  payload: Payload,
  submission: FormSubmissionLike
): Promise<string | null> {
  const orgId = fieldValue(submission, 'org-id')
  const email = fieldValue(submission, 'email').toLowerCase()

  const result = await payload.find({
    collection: 'clients',
    limit: 200,
    depth: 0,
    overrideAccess: true,
  })

  const clients = result.docs as ClientLike[]

  if (orgId) {
    const byOrg = clients.find((client) => client.orgId?.trim() === orgId)
    if (byOrg?.dinqId?.trim()) return byOrg.dinqId.trim()
  }

  if (email) {
    const byEmail = clients.find(
      (client) => client.email?.trim().toLowerCase() === email
    )
    if (byEmail?.dinqId?.trim()) return byEmail.dinqId.trim()
  }

  return null
}

/**
 * After a Payload form submission is saved:
 * 1. Email Ted via Resend
 * 2. Notify the matching DinqClaw client (if any)
 * Failures are swallowed so quote/service forms still succeed.
 */
export async function notifyClientFromFormSubmission(params: {
  payload: Payload
  doc: FormSubmissionLike
}): Promise<void> {
  const { payload, doc } = params
  const name =
    fieldValue(doc, 'full-name') ||
    fieldValue(doc, 'name') ||
    fieldValue(doc, 'company-name') ||
    'Website visitor'
  const email = fieldValue(doc, 'email') || 'unknown@client'
  const message = buildMessage(doc)
  const orgId = fieldValue(doc, 'org-id') || '—'
  const clientName =
    fieldValue(doc, 'company-name') ||
    fieldValue(doc, 'full-name') ||
    fieldValue(doc, 'name') ||
    email
  const submittedAt = doc.createdAt
    ? new Date(doc.createdAt).toISOString()
    : new Date().toISOString()

  try {
    const formName = await resolveFormName(payload, doc)
    await sendFormSubmissionEmail({
      clientName,
      name,
      email,
      message,
      formName,
      orgId,
      submittedAt,
    })
  } catch (err) {
    logger.error('Form submission email failed silently', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
  }

  try {
    const dinqId = await resolveDinqId(payload, doc)
    if (!dinqId) return

    const sourceUrl =
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
      'https://dinqdigital.com'

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
      'http://localhost:3000'

    await fetch(`${baseUrl}/api/notify-client`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dinqId,
        name,
        email,
        message,
        sourceUrl,
      }),
    })
  } catch (err) {
    logger.error('notifyClientFromFormSubmission failed silently', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
  }
}
