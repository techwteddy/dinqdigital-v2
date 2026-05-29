import { PrismaClient, PlanInterval } from '@prisma/client'

const prisma = new PrismaClient()

const STRIPE_PRICE_STARTER_MONTH =
  process.env.STRIPE_PRICE_STARTER_MONTH ?? 'price_starter_month'
const STRIPE_PRICE_PRO_MONTH =
  process.env.STRIPE_PRICE_PRO_MONTH ?? 'price_pro_month'
const STRIPE_PRICE_ENTERPRISE_MONTH =
  process.env.STRIPE_PRICE_ENTERPRISE_MONTH ?? 'price_enterprise_month'

async function main() {
  console.log('Seeding database...')

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for indie hackers and small projects.',
      amount: 900,
      interval: PlanInterval.MONTH,
      stripePriceIdMonth: STRIPE_PRICE_STARTER_MONTH,
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
      amount: 2900,
      interval: PlanInterval.MONTH,
      stripePriceIdMonth: STRIPE_PRICE_PRO_MONTH,
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
      amount: 9900,
      interval: PlanInterval.MONTH,
      stripePriceIdMonth: STRIPE_PRICE_ENTERPRISE_MONTH,
      features: JSON.stringify([
        'Unlimited Organizations',
        'Unlimited Members',
        '500GB Storage',
        '24/7 Dedicated Support',
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
      console.log(`Created plan: ${plan.name}`)
    } else {
      await prisma.plan.update({
        where: { id: existing.id },
        data: {
          stripePriceIdMonth: plan.stripePriceIdMonth,
          amount: plan.amount,
          description: plan.description,
          features: plan.features,
          isPopular: plan.isPopular,
        },
      })
      console.log(`Updated plan: ${plan.name}`)
    }
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
