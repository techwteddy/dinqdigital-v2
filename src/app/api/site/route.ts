import { type NextRequest, NextResponse } from 'next/server'
import { getPayload, type Payload } from 'payload'
import config from '@payload-config'
import { logger } from '@/lib/logger'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function withCors(response: NextResponse) {
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    response.headers.set(key, value)
  }
  return response
}

function normalizeHostname(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .split('/')[0]
    .split(':')[0]
    .replace(/^www\./, '')
}

function mediaUrl(doc: Record<string, unknown>): string {
  if (typeof doc.url === 'string') return doc.url
  if (doc.sizes && typeof doc.sizes === 'object') {
    const sizes = doc.sizes as Record<string, { url?: string }>
    for (const size of Object.values(sizes)) {
      if (size?.url) return size.url
    }
  }
  return ''
}

async function findPagesForOrg(payload: Payload, orgId: string) {
  try {
    // Pages collection may not exist yet — keep services empty until it does.
    const result = await (
      payload.find as (args: {
        collection: string
        limit: number
        depth: number
        where: Record<string, unknown>
        overrideAccess: boolean
      }) => Promise<{ docs: Array<Record<string, unknown>> }>
    )({
      collection: 'pages',
      limit: 100,
      depth: 1,
      where: {
        orgId: { equals: orgId },
      },
      overrideAccess: true,
    })
    return result.docs
  } catch {
    return []
  }
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }))
}

export async function GET(request: NextRequest) {
  try {
    const queryHost = request.nextUrl.searchParams.get('hostname')
    const headerHost =
      request.headers.get('x-forwarded-host') || request.headers.get('host')
    const hostname = normalizeHostname(queryHost || headerHost || '')

    if (!hostname) {
      return withCors(
        NextResponse.json({ error: 'Site not found' }, { status: 404 })
      )
    }

    const payload = await getPayload({ config })

    const domainResult = await payload.find({
      collection: 'domains',
      limit: 1,
      depth: 0,
      where: {
        and: [
          { domain: { equals: hostname } },
          { isActive: { equals: true } },
        ],
      },
      overrideAccess: true,
    })

    const domain = domainResult.docs[0] as
      | {
          domain?: string | null
          orgId?: string | null
          siteName?: string | null
          industry?: string | null
          primaryColor?: string | null
          accentColor?: string | null
          heroTitle?: string | null
          heroDescription?: string | null
          heroCtaText?: string | null
          heroCtaUrl?: string | null
          contactEmail?: string | null
          contactPhone?: string | null
          contactAddress?: string | null
        }
      | undefined

    if (!domain?.orgId) {
      return withCors(
        NextResponse.json({ error: 'Site not found' }, { status: 404 })
      )
    }

    const orgId = domain.orgId

    const [pages, eventsResult, mediaResult, teamResult] = await Promise.all([
      findPagesForOrg(payload, orgId),
      payload.find({
        collection: 'events',
        limit: 100,
        depth: 1,
        where: {
          and: [
            { orgId: { equals: orgId } },
            { status: { equals: 'upcoming' } },
          ],
        },
        sort: 'date',
        overrideAccess: true,
      }),
      payload.find({
        collection: 'media',
        limit: 100,
        depth: 0,
        where: {
          orgId: { equals: orgId },
        },
        overrideAccess: true,
      }),
      payload.find({
        collection: 'team',
        limit: 100,
        depth: 1,
        where: {
          orgId: { equals: orgId },
        },
        overrideAccess: true,
      }),
    ])

    const services = pages.map((page) => ({
      id: page.id,
      title: page.title ?? page.name ?? '',
      description: page.description ?? page.content ?? '',
      slug: page.slug ?? '',
    }))

    const events = eventsResult.docs.map((event) => {
      const image =
        event.image && typeof event.image === 'object'
          ? mediaUrl(event.image as Record<string, unknown>)
          : ''
      return {
        id: event.id,
        title: event.title,
        description: event.description ?? '',
        date: event.date,
        endDate: event.endDate ?? null,
        location: event.location ?? '',
        image,
        status: event.status,
        registrationUrl: event.registrationUrl ?? '',
      }
    })

    const gallery = mediaResult.docs.map((doc) => ({
      id: doc.id,
      url: mediaUrl(doc as unknown as Record<string, unknown>),
      alt: doc.alt ?? '',
    }))

    const team = teamResult.docs.map((member) => {
      const photo =
        member.photo && typeof member.photo === 'object'
          ? mediaUrl(member.photo as Record<string, unknown>)
          : ''
      return {
        id: member.id,
        name: member.name,
        role: member.role ?? '',
        bio: member.bio ?? '',
        photo,
      }
    })

    return withCors(
      NextResponse.json({
        site: {
          name: domain.siteName ?? '',
          industry: domain.industry ?? '',
          orgId,
          domain: domain.domain ?? hostname,
        },
        theme: {
          primary: domain.primaryColor || '#000000',
          accent: domain.accentColor || '#6C5CE7',
        },
        hero: {
          title: domain.heroTitle ?? '',
          description: domain.heroDescription ?? '',
          ctaText: domain.heroCtaText ?? '',
          ctaUrl: domain.heroCtaUrl ?? '',
        },
        services,
        team,
        events,
        gallery,
        contact: {
          email: domain.contactEmail ?? '',
          phone: domain.contactPhone ?? '',
          address: domain.contactAddress ?? '',
        },
      })
    )
  } catch (err) {
    logger.error('Site API failed', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return withCors(
      NextResponse.json({ error: 'Failed to load site' }, { status: 500 })
    )
  }
}
