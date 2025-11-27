import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  prismaPool: Pool | undefined
}

const isSupabase = process.env.DATABASE_URL.includes('supabase.com')
const isNeon = process.env.DATABASE_URL.includes('neon.tech')

const pool =
  globalForPrisma.prismaPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: (isSupabase || isNeon)
      ? { rejectUnauthorized: false }
      : undefined,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
  })

const adapter = new PrismaPg(pool)

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  globalForPrisma.prismaPool = pool
}
