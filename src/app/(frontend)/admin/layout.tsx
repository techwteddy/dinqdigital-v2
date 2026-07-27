import { getDbUserWithMemberships, getUser } from '@/lib/auth'
import { TED_ADMIN_EMAIL } from '@/lib/admin'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await getUser()

  if (!user || user.email !== TED_ADMIN_EMAIL) {
    redirect('/')
  }

  const dbUser = await getDbUserWithMemberships()
  const org = dbUser?.memberships[0]?.organization

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
  }

  return (
    <DashboardShell
      userName={dbUser?.name ?? 'Ted'}
      userEmail={user.email ?? ''}
      orgName={org?.name ?? 'Dinq Digital'}
      planName="Agency"
      basePath="/admin"
      signOutAction={signOut}
    >
      {children}
    </DashboardShell>
  )
}
