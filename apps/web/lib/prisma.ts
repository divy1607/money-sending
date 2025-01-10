import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

// Test database connection
prisma.$connect()
  .then(() => {
    console.log('✅ Database connection successful')
    // Test query
    return prisma.user.count()
  })
  .then((count) => {
    console.log(`📊 Current user count: ${count}`)
  })
  .catch((e) => {
    console.error('❌ Database connection failed:', e)
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma