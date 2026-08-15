import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { notifyDinqClaw } from '@/lib/dinqclaw'

const notifyClientSchema = z.object({
  dinqId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
  sourceUrl: z.string().url().or(z.string().min(1)),
})

/**
 * Proxies client notifications to DinqClaw.
 * Reminder: set DINQCLAW_API_KEY in Vercel environment variables
 * (Production + Preview) — same value as DinqClaw's shared secret.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const input = notifyClientSchema.parse(body)
    const result = await notifyDinqClaw(input)

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error ?? 'Notify failed' },
        { status: result.status >= 400 ? result.status : 502 }
      )
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    // Never throw — keep callers (quote form) healthy.
    return NextResponse.json(
      { error: 'Failed to notify client' },
      { status: 500 }
    )
  }
}
