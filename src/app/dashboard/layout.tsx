import { getDbUserWithMemberships, requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await requireAuth()
  const dbUser = await getDbUserWithMemberships()

  const org = dbUser?.memberships[0]?.organization

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
  }

  return (
    <>
      <DashboardShell
        userName={dbUser?.name ?? 'User'}
        userEmail={user.email ?? ''}
        orgName={org?.name}
        planName={org?.subscription?.plan?.name}
        signOutAction={signOut}
      >
        {children}
      </DashboardShell>
    </>
  )
}
