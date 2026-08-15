import { logger } from '@/lib/logger'

export type DinqClawNotifyInput = {
  dinqId: string
  name: string
  email: string
  message: string
  sourceUrl: string
}

/**
 * Forwards a notification to DinqClaw.
 * Never throws — quote/form flows must keep working if DinqClaw is down.
 *
 * Reminder: set DINQCLAW_API_KEY in Vercel project environment variables
 * (Production + Preview) to match DinqClaw's shared secret.
 */
export async function notifyDinqClaw(
  input: DinqClawNotifyInput
): Promise<{ ok: boolean; status: number; error?: string }> {
  try {
    const apiKey = process.env.DINQCLAW_API_KEY
    if (!apiKey) {
      logger.error('DinqClaw notify skipped — DINQCLAW_API_KEY is not set')
      return { ok: false, status: 500, error: 'DINQCLAW_API_KEY missing' }
    }

    const response = await fetch('https://dinqclaw.vercel.app/api/notify', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dinq_id: input.dinqId,
        name: input.name,
        email: input.email,
        message: input.message,
        source_url: input.sourceUrl,
      }),
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      logger.error('DinqClaw notify failed', {
        status: response.status,
        detail: detail.slice(0, 500),
      })
      return {
        ok: false,
        status: response.status,
        error: detail || 'DinqClaw request failed',
      }
    }

    return { ok: true, status: 200 }
  } catch (err) {
    logger.error('DinqClaw notify error', {
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return { ok: false, status: 500, error: 'DinqClaw unreachable' }
  }
}
