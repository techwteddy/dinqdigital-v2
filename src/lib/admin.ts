import { getPayload } from 'payload'
import config from '@payload-config'
import { formatRelativeDate } from '@/lib/utils'

export const TED_ADMIN_EMAIL = 'techwithteddy@gmail.com'

export type SubmissionDataItem = {
  field?: string | null
  value?: string | null
}

export type FormSubmissionDoc = {
  id: string | number
  createdAt?: string
  submissionData?: SubmissionDataItem[] | null
}

export type ClientDoc = {
  id: string | number
  companyName?: string | null
  contactName?: string | null
  email?: string | null
  plan?: string | null
  status?: string | null
  createdAt?: string
  website?: string | null
  notes?: string | null
}

export type DealDoc = {
  id: string | number
  value?: number | null
  stage?: string | null
  startDate?: string | null
  createdAt?: string
  notes?: string | null
  client?:
    | number
    | string
    | {
        id?: string | number
        companyName?: string | null
      }
    | null
}

export function getSubmissionField(
  submission: FormSubmissionDoc,
  fieldName: string
): string {
  const match = submission.submissionData?.find(
    (item) => item.field === fieldName
  )
  return match?.value?.trim() || '—'
}

export function formatPlanLabel(plan?: string | null): string {
  switch (plan) {
    case '500':
      return '$500'
    case '1200':
      return '$1,200'
    case 'custom':
      return 'Custom'
    default:
      return plan?.trim() || '—'
  }
}

export function formatDealStage(stage?: string | null): string {
  switch (stage) {
    case 'discovery':
      return 'Pending'
    case 'proposal':
      return 'Contacting'
    case 'won':
      return 'Won'
    case 'lost':
      return 'Lost'
    default:
      return stage?.trim() || '—'
  }
}

export function formatCurrency(value?: number | null): string {
  if (value == null || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatAdminDate(date?: string | null): string {
  if (!date) return '—'
  return formatRelativeDate(date)
}

async function getAdminPayload() {
  return getPayload({ config })
}

export async function getFormSubmissions(limit = 100) {
  const payload = await getAdminPayload()
  const result = await payload.find({
    collection: 'form-submissions',
    limit,
    depth: 1,
    sort: '-createdAt',
    overrideAccess: true,
  })
  return {
    docs: result.docs as FormSubmissionDoc[],
    totalDocs: result.totalDocs,
  }
}

export async function getFormSubmissionById(id: string) {
  const payload = await getAdminPayload()
  try {
    const doc = await payload.findByID({
      collection: 'form-submissions',
      id,
      depth: 1,
      overrideAccess: true,
    })
    return doc as FormSubmissionDoc
  } catch {
    return null
  }
}

export async function getClients(limit = 100) {
  const payload = await getAdminPayload()
  const result = await payload.find({
    collection: 'clients',
    limit,
    depth: 0,
    sort: '-createdAt',
    overrideAccess: true,
  })
  return {
    docs: result.docs as ClientDoc[],
    totalDocs: result.totalDocs,
  }
}

export async function getActiveClientsCount() {
  const payload = await getAdminPayload()
  const result = await payload.find({
    collection: 'clients',
    limit: 1,
    depth: 0,
    where: {
      status: {
        equals: 'active',
      },
    },
    overrideAccess: true,
  })
  return result.totalDocs
}

export async function getDeals(limit = 100) {
  const payload = await getAdminPayload()
  const result = await payload.find({
    collection: 'deals',
    limit,
    depth: 1,
    sort: '-createdAt',
    overrideAccess: true,
  })
  return {
    docs: result.docs as DealDoc[],
    totalDocs: result.totalDocs,
  }
}

export async function getOpenDealsCount() {
  const payload = await getAdminPayload()
  const result = await payload.find({
    collection: 'deals',
    limit: 1,
    depth: 0,
    where: {
      stage: {
        in: ['discovery', 'proposal'],
      },
    },
    overrideAccess: true,
  })
  return result.totalDocs
}

export function getDealClientName(deal: DealDoc): string {
  if (deal.client && typeof deal.client === 'object') {
    return deal.client.companyName?.trim() || 'Untitled client'
  }
  return 'Untitled client'
}
