jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({ url: 'https://checkout.stripe.com' }),
      },
    },
    billingPortal: {
      sessions: {
        create: jest.fn().mockResolvedValue({ url: 'https://billing.stripe.com' }),
      },
    },
    customers: {
      retrieve: jest.fn().mockResolvedValue({ id: 'cus_existing' }),
      create: jest.fn().mockResolvedValue({ id: 'cus_new' }),
    },
    webhooks: {
      constructEvent: jest.fn().mockReturnValue({ type: 'test.event' }),
    },
  }))
})

import { stripe } from './stripe'
import {
  constructStripeEvent,
  createBillingPortalSession,
  createCheckoutSession,
  formatPrice,
  getOrCreateStripeCustomer,
} from './stripe'

describe('stripe helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(stripe.checkout.sessions.create as jest.Mock).mockResolvedValue({
      url: 'https://checkout.stripe.com',
    })
    ;(stripe.billingPortal.sessions.create as jest.Mock).mockResolvedValue({
      url: 'https://billing.stripe.com',
    })
    ;(stripe.customers.retrieve as jest.Mock).mockResolvedValue({ id: 'cus_existing' })
    ;(stripe.customers.create as jest.Mock).mockResolvedValue({ id: 'cus_new' })
    ;(stripe.webhooks.constructEvent as jest.Mock).mockReturnValue({ type: 'test.event' })
  })

  describe('createCheckoutSession', () => {
    it('creates a subscription checkout session', async () => {
      const result = await createCheckoutSession({
        priceId: 'price_123',
        organizationId: 'org_123',
        successUrl: 'http://localhost/success',
        cancelUrl: 'http://localhost/cancel',
        trialDays: 14,
        customerId: 'cus_123',
      })

      expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'subscription',
          customer: 'cus_123',
          line_items: [{ price: 'price_123', quantity: 1 }],
        })
      )
      expect(result.url).toBe('https://checkout.stripe.com')
    })
  })

  describe('createBillingPortalSession', () => {
    it('creates a billing portal session', async () => {
      await createBillingPortalSession({
        customerId: 'cus_123',
        returnUrl: 'http://localhost/billing',
      })

      expect(stripe.billingPortal.sessions.create).toHaveBeenCalledWith({
        customer: 'cus_123',
        return_url: 'http://localhost/billing',
      })
    })
  })

  describe('getOrCreateStripeCustomer', () => {
    it('retrieves existing customer', async () => {
      const customer = await getOrCreateStripeCustomer({
        organizationId: 'org_1',
        organizationName: 'Acme',
        email: 'a@b.com',
        existingCustomerId: 'cus_existing',
      })

      expect(stripe.customers.retrieve).toHaveBeenCalledWith('cus_existing')
      expect(stripe.customers.create).not.toHaveBeenCalled()
      expect(customer.id).toBe('cus_existing')
    })

    it('creates new customer when none exists', async () => {
      const customer = await getOrCreateStripeCustomer({
        organizationId: 'org_1',
        organizationName: 'Acme',
        email: 'a@b.com',
      })

      expect(stripe.customers.create).toHaveBeenCalled()
      expect(customer.id).toBe('cus_new')
    })
  })

  describe('constructStripeEvent', () => {
    it('verifies webhook signature', () => {
      const event = constructStripeEvent('payload', 'sig')
      expect(stripe.webhooks.constructEvent).toHaveBeenCalled()
      expect(event.type).toBe('test.event')
    })
  })

  describe('formatPrice', () => {
    it('formats whole dollar amounts without decimals', () => {
      expect(formatPrice(2900)).toBe('$29')
    })

    it('formats amounts with cents', () => {
      expect(formatPrice(995)).toBe('$9.95')
    })

    it('accepts custom currency and locale', () => {
      expect(formatPrice(1000, 'eur', 'de-DE')).toMatch(/10/)
    })
  })
})
