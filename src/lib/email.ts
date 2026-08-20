import { Resend } from 'resend'
import { TED_ADMIN_EMAIL } from '@/lib/constants'
import { APP_NAME, EMAIL_FROM, SUPPORT_EMAIL } from '@/lib/site'
import { logger } from '@/lib/logger'

const resendApiKey = process.env.RESEND_API_KEY
const fromAddress = process.env.EMAIL_FROM ?? EMAIL_FROM
const FORM_NOTIFY_FROM = 'notifications@dinqdigital.com'

function getClient() {
  if (!resendApiKey) return null
  return new Resend(resendApiKey)
}

export async function sendInvitationEmail({
  to,
  organizationName,
  inviteUrl,
  inviterName,
}: {
  to: string
  organizationName: string
  inviteUrl: string
  inviterName?: string | null
}) {
  const client = getClient()
  if (!client) {
    logger.warn('RESEND_API_KEY not set; skipping invitation email', { to })
    return { skipped: true as const }
  }

  const inviter = inviterName ?? 'A team member'

  await client.emails.send({
    from: fromAddress,
    to,
    subject: `You're invited to join ${organizationName} on ${APP_NAME}`,
    html: `
      <p>${inviter} invited you to join <strong>${organizationName}</strong> on ${APP_NAME}.</p>
      <p><a href="${inviteUrl}">Accept invitation</a></p>
      <p>This link expires in 7 days. If you did not expect this email, you can ignore it.</p>
      <p>Questions? Contact ${SUPPORT_EMAIL}</p>
    `,
  })

  return { sent: true as const }
}

export async function sendFormSubmissionEmail({
  clientName,
  name,
  email,
  message,
  formName,
  orgId,
  submittedAt,
}: {
  clientName: string
  name: string
  email: string
  message: string
  formName: string
  orgId: string
  submittedAt: string
}) {
  const client = getClient()
  if (!client) {
    logger.warn('RESEND_API_KEY not set; skipping form submission email', {
      email,
    })
    return { skipped: true as const }
  }

  const subject = `New form submission from ${clientName}`
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Message: ${message}`,
    `Form: ${formName}`,
    `OrgId: ${orgId}`,
    `Submitted: ${submittedAt}`,
  ].join('\n')

  await client.emails.send({
    from: FORM_NOTIFY_FROM,
    to: TED_ADMIN_EMAIL,
    subject,
    text,
    html: `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(message)}</pre>
      <p><strong>Form:</strong> ${escapeHtml(formName)}</p>
      <p><strong>OrgId:</strong> ${escapeHtml(orgId)}</p>
      <p><strong>Submitted:</strong> ${escapeHtml(submittedAt)}</p>
    `,
  })

  return { sent: true as const }
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
