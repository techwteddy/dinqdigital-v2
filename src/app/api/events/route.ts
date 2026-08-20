import { type NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const orgId = request.nextUrl.searchParams.get('orgId')?.trim()
    if (!orgId) {
      return NextResponse.json(
        { error: 'orgId query parameter is required' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'events',
      limit: 100,
      depth: 1,
      where: {
        orgId: {
          equals: orgId,
        },
      },
      sort: 'date',
      overrideAccess: true,
    })

    return NextResponse.json({ events: result.docs })
  } catch (err) {
    logger.error('List events failed', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return NextResponse.json(
      { error: 'Failed to list events' },
      { status: 500 }
    )
  }
}
