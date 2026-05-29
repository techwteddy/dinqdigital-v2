import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { DeveloperCredit } from '@/components/layout/developer-credit'
import { SHOW_DEVELOPER_CREDIT } from '@/lib/site'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await requireAuth()

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      memberships: {
        include: {
          organization: {
            include: { subscription: { include: { plan: true } } },
          },
        },
        take: 1,
      },
    },
  })

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
      {SHOW_DEVELOPER_CREDIT && (
        <div className="border-t border-border bg-muted/20 py-2 text-center md:pl-64">
          <DeveloperCredit variant="compact" />
        </div>
      )}
    </>
  )
}
