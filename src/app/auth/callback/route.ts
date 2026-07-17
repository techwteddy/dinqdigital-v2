import { type NextRequest } from 'next/server'
import { handleAuthCallback } from '@/lib/auth/handle-callback'

// This endpoint reads query parameters, verifies an OTP, and writes auth
// cookies. Force a server function so it can never be emitted as static output.
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/** Supabase email / OAuth callback — works cross-device via token_hash */
export async function GET(request: NextRequest) {
  return handleAuthCallback(request)
}
