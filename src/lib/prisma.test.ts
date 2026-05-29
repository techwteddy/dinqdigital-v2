const mockPrismaInstance = {
  user: { findUnique: jest.fn() },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
}

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrismaInstance),
}))

describe('prisma client', () => {
  const originalEnv = process.env.NODE_ENV

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
    jest.resetModules()
    const globalForPrisma = globalThis as { prisma?: unknown }
    delete globalForPrisma.prisma
  })

  it('exports a PrismaClient instance', async () => {
    const { prisma } = await import('./prisma')
    expect(prisma).toBeDefined()
    expect(prisma.user).toBeDefined()
  })

  it('reuses singleton in non-production', async () => {
    process.env.NODE_ENV = 'development'
    jest.resetModules()
    const mod1 = await import('./prisma')
    const mod2 = await import('./prisma')
    expect(mod1.prisma).toBe(mod2.prisma)
  })

  it('uses production error-only logging on first init', async () => {
    process.env.NODE_ENV = 'production'
    jest.resetModules()
    const globalForPrisma = globalThis as { prisma?: unknown }
    delete globalForPrisma.prisma

    const { PrismaClient } = await import('@prisma/client')
    await import('./prisma')

    expect(PrismaClient).toHaveBeenCalledWith({ log: ['error'] })
  })
})
