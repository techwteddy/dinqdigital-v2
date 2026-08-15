import type { Payload } from 'payload'
import { logger } from '@/lib/logger'

type SubmissionDataItem = {
  field?: string | null
  value?: string | null
}

type FormSubmissionLike = {
  id?: string | number
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
    fieldValue(submission, 'description')
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
 * After a Payload form submission is saved, notify the matching DinqClaw client.
 * Failures are swallowed so quote/service forms still succeed.
 */
export async function notifyClientFromFormSubmission(params: {
  payload: Payload
  doc: FormSubmissionLike
}): Promise<void> {
  try {
    const { payload, doc } = params
    const dinqId = await resolveDinqId(payload, doc)
    if (!dinqId) return

    const name =
      fieldValue(doc, 'full-name') ||
      fieldValue(doc, 'company-name') ||
      'Website visitor'
    const email = fieldValue(doc, 'email') || 'unknown@client'
    const message = buildMessage(doc)
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
