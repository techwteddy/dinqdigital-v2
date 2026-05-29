/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'

const mockConstructStripeEvent = jest.fn()
const mockSubscriptionRetrieve = jest.fn()
const mockPlanFindFirst = jest.fn()
const mockSubscriptionUpsert = jest.fn()
const mockSubscriptionUpdate = jest.fn()

jest.mock('@/lib/stripe', () => ({
  constructStripeEvent: (...args: unknown[]) => mockConstructStripeEvent(...args),
  stripe: {
    subscriptions: {
      retrieve: (...args: unknown[]) => mockSubscriptionRetrieve(...args),
    },
  },
}))

jest.mock('@/lib/prisma', () => ({
  prisma: {
    plan: { findFirst: (...args: unknown[]) => mockPlanFindFirst(...args) },
    subscription: {
      upsert: (...args: unknown[]) => mockSubscriptionUpsert(...args),
      update: (...args: unknown[]) => mockSubscriptionUpdate(...args),
    },
  },
}))

import { POST } from './route'

function createWebhookRequest(body: string, signature?: string) {
  const headers: Record<string, string> = {}
  if (signature) headers['stripe-signature'] = signature
  return new NextRequest('http://localhost/api/webhooks/stripe', {
    method: 'POST',
    body,
    headers,
  })
}

describe('POST /api/webhooks/stripe', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'log').mockImplementation()
    jest.spyOn(console, 'error').mockImplementation()
    mockSubscriptionUpdate.mockResolvedValue({})
    mockSubscriptionUpsert.mockResolvedValue({})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns 400 when signature is missing', async () => {
    const response = await POST(createWebhookRequest('{}'))
    expect(response.status).toBe(400)
  })

  it('returns 400 when signature verification fails', async () => {
    mockConstructStripeEvent.mockImplementation(() => {
      throw new Error('invalid')
    })

    const response = await POST(createWebhookRequest('{}', 'bad-sig'))
    expect(response.status).toBe(400)
  })

  it('handles checkout.session.completed', async () => {
    mockConstructStripeEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: {
        object: {
          mode: 'subscription',
          metadata: { organizationId: 'org-1' },
          subscription: 'sub_123',
        },
      },
    })
    mockSubscriptionRetrieve.mockResolvedValue({
      id: 'sub_123',
      status: 'active',
      current_period_start: 1000,
      current_period_end: 2000,
      cancel_at_period_end: false,
      trial_end: 1700000000,
      items: { data: [{ price: { id: 'price_month' } }] },
    })
    mockPlanFindFirst.mockResolvedValue({ id: 'plan-1' })

    const response = await POST(createWebhookRequest('{}', 'valid-sig'))
    expect(response.status).toBe(200)
    expect(mockSubscriptionUpsert).toHaveBeenCalled()
  })

  it('skips checkout when mode is not subscription', async () => {
    mockConstructStripeEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: { mode: 'payment', metadata: {} } },
    })

    await POST(createWebhookRequest('{}', 'valid-sig'))
    expect(mockSubscriptionRetrieve).not.toHaveBeenCalled()
  })

  it('skips checkout when organizationId is missing', async () => {
    mockConstructStripeEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: {
        object: { mode: 'subscription', metadata: {}, subscription: 'sub_1' },
      },
    })

    await POST(createWebhookRequest('{}', 'valid-sig'))
    expect(mockSubscriptionRetrieve).not.toHaveBeenCalled()
  })

  it('handles checkout without trial end', async () => {
    mockConstructStripeEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: {
        object: {
          mode: 'subscription',
          metadata: { organizationId: 'org-2' },
          subscription: 'sub_no_trial',
        },
      },
    })
    mockSubscriptionRetrieve.mockResolvedValue({
      id: 'sub_no_trial',
      status: 'active',
      current_period_start: 1000,
      current_period_end: 2000,
      cancel_at_period_end: false,
      trial_end: null,
      items: { data: [{ price: { id: 'price_month' } }] },
    })
    mockPlanFindFirst.mockResolvedValue({ id: 'plan-1' })

    await POST(createWebhookRequest('{}', 'valid-sig'))
    expect(mockSubscriptionUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ trialEnd: null }),
        update: expect.objectContaining({ trialEnd: null }),
      })
    )
  })

  it('skips upsert when plan is not found', async () => {
    mockConstructStripeEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: {
        object: {
          mode: 'subscription',
          metadata: { organizationId: 'org-1' },
          subscription: 'sub_123',
        },
      },
    })
    mockSubscriptionRetrieve.mockResolvedValue({
      id: 'sub_123',
      status: 'active',
      current_period_start: 1000,
      current_period_end: 2000,
      cancel_at_period_end: false,
      trial_end: 1700000000,
      items: { data: [{ price: { id: 'unknown' } }] },
    })
    mockPlanFindFirst.mockResolvedValue(null)

    await POST(createWebhookRequest('{}', 'valid-sig'))
    expect(mockSubscriptionUpsert).not.toHaveBeenCalled()
  })

  it('handles customer.subscription.updated', async () => {
    mockConstructStripeEvent.mockReturnValue({
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: 'sub_123',
          status: 'active',
          current_period_start: 1000,
          current_period_end: 2000,
          cancel_at_period_end: true,
          trial_end: 1700000000,
        },
      },
    })

    const response = await POST(createWebhookRequest('{}', 'valid-sig'))
    expect(response.status).toBe(200)
    expect(mockSubscriptionUpdate).toHaveBeenCalled()
  })

  it('handles subscription.updated without trial end', async () => {
    mockConstructStripeEvent.mockReturnValue({
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: 'sub_456',
          status: 'past_due',
          current_period_start: 1000,
          current_period_end: 2000,
          cancel_at_period_end: false,
          trial_end: null,
        },
      },
    })

    const response = await POST(createWebhookRequest('{}', 'valid-sig'))
    expect(response.status).toBe(200)
    expect(mockSubscriptionUpdate).toHaveBeenCalled()
  })

  it('handles customer.subscription.deleted', async () => {
    mockConstructStripeEvent.mockReturnValue({
      type: 'customer.subscription.deleted',
      data: { object: { id: 'sub_123' } },
    })

    await POST(createWebhookRequest('{}', 'valid-sig'))
    expect(mockSubscriptionUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: 'CANCELED' }),
      })
    )
  })

  it('handles invoice.payment_failed', async () => {
    mockConstructStripeEvent.mockReturnValue({
      type: 'invoice.payment_failed',
      data: { object: { subscription: 'sub_123' } },
    })

    await POST(createWebhookRequest('{}', 'valid-sig'))
    expect(mockSubscriptionUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: 'PAST_DUE' } })
    )
  })

  it('skips invoice.payment_failed without subscription', async () => {
    mockConstructStripeEvent.mockReturnValue({
      type: 'invoice.payment_failed',
      data: { object: { subscription: null } },
    })

    await POST(createWebhookRequest('{}', 'valid-sig'))
    expect(mockSubscriptionUpdate).not.toHaveBeenCalled()
  })

  it('logs unhandled event types', async () => {
    mockConstructStripeEvent.mockReturnValue({
      type: 'unknown.event',
      data: { object: {} },
    })

    const response = await POST(createWebhookRequest('{}', 'valid-sig'))
    expect(response.status).toBe(200)
  })

  it('returns 500 when handler throws', async () => {
    mockConstructStripeEvent.mockReturnValue({
      type: 'customer.subscription.updated',
      data: { object: { id: 'sub_123' } },
    })
    mockSubscriptionUpdate.mockRejectedValue(new Error('db error'))

    const response = await POST(createWebhookRequest('{}', 'valid-sig'))
    expect(response.status).toBe(500)
  })
})
