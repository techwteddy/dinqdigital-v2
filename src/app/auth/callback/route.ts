import { type NextRequest } from 'next/server'
import { handleAuthCallback } from '@/lib/auth/handle-callback'

/** Supabase email / OAuth callback — works cross-device via token_hash */
export async function GET(request: NextRequest) {
  return handleAuthCallback(request)
}
