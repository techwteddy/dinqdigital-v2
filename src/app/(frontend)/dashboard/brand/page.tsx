import type { Metadata } from 'next'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { BrandKitForm } from '@/components/dashboard/brand-kit-form'
import { requireAuth } from '@/lib/auth'

export const metadata: Metadata = { title: 'Brand Kit' }

export default async function DashboardBrandPage() {
  await requireAuth()

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Brand Kit"
        description="Colors, fonts, and assets for your project."
      />
      <BrandKitForm />
    </div>
  )
}
