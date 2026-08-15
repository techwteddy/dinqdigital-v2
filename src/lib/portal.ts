import { getPayload } from 'payload'
import config from '@payload-config'
import { formatRelativeDate } from '@/lib/utils'

export const PROJECT_STAGES = [
  { key: 'discovery', label: 'Discovery' },
  { key: 'design', label: 'Design' },
  { key: 'dev', label: 'Development' },
  { key: 'qa', label: 'QA' },
  { key: 'launch', label: 'Launch' },
] as const

export type ProjectStatus =
  | 'discovery'
  | 'design'
  | 'dev'
  | 'qa'
  | 'launch'
  | 'complete'

export type ProjectDoc = {
  id: string | number
  clientName?: string | null
  orgId?: string | null
  status?: ProjectStatus | string | null
  startDate?: string | null
  estimatedEndDate?: string | null
  value?: number | null
  notes?: string | null
}

export type MilestoneDoc = {
  id: string | number
  title?: string | null
  status?: 'pending' | 'in-progress' | 'complete' | string | null
  dueDate?: string | null
  notes?: string | null
  project?: string | number | { id?: string | number } | null
}

export type MediaDoc = {
  id: string | number
  alt?: string | null
  filename?: string | null
  url?: string | null
  filesize?: number | null
  mimeType?: string | null
  createdAt?: string
  updatedAt?: string
}

export type FormSubmissionDoc = {
  id: string | number
  createdAt?: string
  form?: string | number | { id?: string | number; title?: string | null } | null
  submissionData?: Array<{ field?: string | null; value?: string | null }> | null
}

const SERVICE_REQUEST_FORM_TITLE = 'Service Request'

async function getPortalPayload() {
  return getPayload({ config })
}

export function formatBytes(bytes?: number | null): string {
  if (bytes == null || Number.isNaN(bytes) || bytes <= 0) return '—'
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unit = 0
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024
    unit += 1
  }
  return `${size.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`
}

export function formatPortalDate(date?: string | null): string {
  if (!date) return '—'
  return formatRelativeDate(date)
}

export function getStageIndex(status?: string | null): number {
  if (!status) return 0
  if (status === 'complete') return PROJECT_STAGES.length
  const index = PROJECT_STAGES.findIndex((stage) => stage.key === status)
  return index >= 0 ? index : 0
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

export async function getProjectByOrgId(orgId: string) {
  const payload = await getPortalPayload()
  const result = await payload.find({
    collection: 'projects',
    limit: 1,
    depth: 0,
    where: {
      orgId: {
        equals: orgId,
      },
    },
    sort: '-createdAt',
    overrideAccess: true,
  })
  return (result.docs[0] as ProjectDoc | undefined) ?? null
}

export async function getMilestonesForOrg(orgId: string) {
  const project = await getProjectByOrgId(orgId)
  if (!project) return []

  const payload = await getPortalPayload()
  const result = await payload.find({
    collection: 'milestones',
    limit: 100,
    depth: 0,
    where: {
      project: {
        equals: project.id,
      },
    },
    sort: 'dueDate',
    overrideAccess: true,
  })
  return result.docs as MilestoneDoc[]
}

export async function getMediaByOrgId(orgId: string) {
  const payload = await getPortalPayload()
  const result = await payload.find({
    collection: 'media',
    limit: 100,
    depth: 0,
    where: {
      alt: {
        contains: orgId,
      },
    },
    sort: '-createdAt',
    overrideAccess: true,
  })
  return result.docs as MediaDoc[]
}

export async function getAllMedia(limit = 100) {
  const payload = await getPortalPayload()
  const result = await payload.find({
    collection: 'media',
    limit,
    depth: 0,
    sort: '-createdAt',
    overrideAccess: true,
  })
  return result.docs as MediaDoc[]
}

export async function ensureServiceRequestFormId(): Promise<string> {
  const payload = await getPortalPayload()
  const existing = await payload.find({
    collection: 'forms',
    limit: 1,
    where: {
      title: {
        equals: SERVICE_REQUEST_FORM_TITLE,
      },
    },
    overrideAccess: true,
  })

  const existingId = existing.docs[0]?.id
  if (existingId != null) return String(existingId)

  const created = await payload.create({
    collection: 'forms',
    overrideAccess: true,
    data: {
      title: SERVICE_REQUEST_FORM_TITLE,
      submitButtonLabel: 'Submit Request',
      confirmationType: 'message',
      fields: [
        {
          blockType: 'select',
          name: 'request-type',
          label: 'Request Type',
          required: true,
          options: [
            { label: 'New Feature', value: 'New Feature' },
            { label: 'Content Update', value: 'Content Update' },
            { label: 'Design Change', value: 'Design Change' },
            { label: 'Additional Page', value: 'Additional Page' },
            { label: 'Integration Request', value: 'Integration Request' },
          ],
        },
        {
          blockType: 'textarea',
          name: 'description',
          label: 'Description',
          required: true,
        },
        {
          blockType: 'text',
          name: 'org-id',
          label: 'Organization ID',
        },
        {
          blockType: 'email',
          name: 'email',
          label: 'Email',
        },
      ],
    },
  })

  return String(created.id)
}

export async function getServiceRequestsForOrg(orgId: string) {
  const formId = await ensureServiceRequestFormId()
  const payload = await getPortalPayload()
  const result = await payload.find({
    collection: 'form-submissions',
    limit: 50,
    depth: 0,
    where: {
      form: {
        equals: formId,
      },
    },
    sort: '-createdAt',
    overrideAccess: true,
  })

  return (result.docs as FormSubmissionDoc[]).filter((doc) => {
    const value = getSubmissionField(doc, 'org-id')
    return value === orgId
  })
}
