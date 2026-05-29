import { type NextRequest, NextResponse } from 'next/server'
import type { SubscriptionStatus } from '@prisma/client'
import type Stripe from 'stripe'
import { constructStripeEvent } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

const STRIPE_TO_SUBSCRIPTION_STATUS: Record<
  Stripe.Subscription.Status,
  SubscriptionStatus
> = {
  active: 'ACTIVE',
  canceled: 'CANCELED',
  incomplete: 'INCOMPLETE',
  incomplete_expired: 'INCOMPLETE_EXPIRED',
  past_due: 'PAST_DUE',
  paused: 'PAUSED',
  trialing: 'TRIALING',
  unpaid: 'UNPAID',
}

function mapStripeSubscriptionStatus(
  status: Stripe.Subscription.Status
): SubscriptionStatus {
  return STRIPE_TO_SUBSCRIPTION_STATUS[status]
}

/**
 * Stripe Webhook Handler
 *
 * Handles the following events:
 * - checkout.session.completed
 * - customer.subscription.updated
 * - customer.subscription.deleted
 * - invoice.payment_failed
 */
export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = constructStripeEvent(body, signature)
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid webhook signature' },
      { status: 400 }
    )
  }

  console.info(`✅ Stripe webhook received: ${event.type}`)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        )
        break
      }
      case 'customer.subscription.updated': {
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        )
        break
      }
      case 'customer.subscription.deleted': {
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        )
        break
      }
      case 'invoice.payment_failed': {
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break
      }
      default:
        console.info(`ℹ️  Unhandled event type: ${event.type}`)
    }
  } catch (err) {
    console.error(`❌ Error handling ${event.type}:`, err)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true })
}

// ─────────────────────────────────────────────
// EVENT HANDLERS
// ─────────────────────────────────────────────

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  if (session.mode !== 'subscription') return

  const organizationId = session.metadata?.organizationId
  if (!organizationId) {
    console.error('No organizationId in session metadata')
    return
  }

  const subscription = await import('@/lib/stripe').then(({ stripe }) =>
    stripe.subscriptions.retrieve(session.subscription as string, {
      expand: ['items.data.price.product'],
    })
  )

  const priceId = subscription.items.data[0].price.id

  // We store both monthly and yearly price IDs — match whichever they picked
  const plan = await prisma.plan.findFirst({
    where: {
      OR: [{ stripePriceIdMonth: priceId }, { stripePriceIdYear: priceId }],
    },
  })

  if (!plan) {
    console.error(`No plan found for priceId: ${priceId}`)
    return
  }

  await prisma.subscription.upsert({
    where: { organizationId },
    create: {
      organizationId,
      planId: plan.id,
      stripeSubscriptionId: subscription.id,
      status: mapStripeSubscriptionStatus(subscription.status),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
    },
    update: {
      planId: plan.id,
      stripeSubscriptionId: subscription.id,
      status: mapStripeSubscriptionStatus(subscription.status),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
    },
  })

  console.info(`✅ Subscription created for org: ${organizationId}`)
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: mapStripeSubscriptionStatus(subscription.status),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
    },
  })
  console.info(`✅ Subscription updated: ${subscription.id}`)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: 'CANCELED',
      cancelAtPeriodEnd: false,
    },
  })
  console.info(`✅ Subscription canceled: ${subscription.id}`)
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return

  await prisma.subscription.update({
    where: { stripeSubscriptionId: invoice.subscription as string },
    data: { status: 'PAST_DUE' },
  })
  console.info(`⚠️  Payment failed for subscription: ${invoice.subscription}`)
}
