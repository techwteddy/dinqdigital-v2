import { PrismaClient, PlanInterval } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Upsert plans
  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for indie hackers and small projects.',
      amount: 900, // $9/mo
      interval: PlanInterval.MONTH,
      features: JSON.stringify([
        '1 Organization',
        'Up to 3 Members',
        '5GB Storage',
        'Email Support',
        'Basic Analytics',
      ]),
      isPopular: false,
      isActive: true,
      sortOrder: 1,
    },
    {
      name: 'Pro',
      description: 'For growing startups that need more power.',
      amount: 2900, // $29/mo
      interval: PlanInterval.MONTH,
      features: JSON.stringify([
        '3 Organizations',
        'Up to 25 Members',
        '50GB Storage',
        'Priority Support',
        'Advanced Analytics',
        'Custom Domain',
        'API Access',
      ]),
      isPopular: true,
      isActive: true,
      sortOrder: 2,
    },
    {
      name: 'Enterprise',
      description: 'For large teams with custom requirements.',
      amount: 9900, // $99/mo
      interval: PlanInterval.MONTH,
      features: JSON.stringify([
        'Unlimited Organizations',
        'Unlimited Members',
        '500GB Storage',
        '24/7 Dedicated Support',
        'Custom Analytics',
        'Custom Domain',
        'Full API Access',
        'SSO / SAML',
        'SLA',
        'Custom Integrations',
      ]),
      isPopular: false,
      isActive: true,
      sortOrder: 3,
    },
  ]

  for (const plan of plans) {
    const existing = await prisma.plan.findFirst({
      where: { name: plan.name },
    })

    if (!existing) {
      await prisma.plan.create({ data: plan })
      console.log(`✅ Created plan: ${plan.name}`)
    } else {
      console.log(`⏭️  Plan already exists: ${plan.name}`)
    }
  }

  console.log('✅ Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
