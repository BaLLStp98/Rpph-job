import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  transactionOptions: {
    timeout: 10000, // 10 seconds
    maxWait: 5000,  // 5 seconds
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma