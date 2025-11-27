import { prisma } from './prisma'

const FREE_LIMIT = 50
const PRO_LIMIT = 10000 // Effectively unlimited for Pro users

export async function getUserPlan(userId: string): Promise<'FREE' | 'PRO'> {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: 'active',
      currentPeriodEnd: {
        gte: new Date()
      }
    }
  })

  return subscription ? 'PRO' : 'FREE'
}

export async function getUserUsageThisPeriod(userId: string): Promise<number> {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const count = await prisma.generation.count({
    where: {
      userId,
      createdAt: {
        gte: startOfMonth
      }
    }
  })

  return count
}

export async function canUseTool(userId: string): Promise<{
  allowed: boolean
  remaining: number
  limit: number
  plan: 'FREE' | 'PRO'
}> {
  const plan = await getUserPlan(userId)
  const usage = await getUserUsageThisPeriod(userId)
  const limit = plan === 'PRO' ? PRO_LIMIT : FREE_LIMIT
  const remaining = Math.max(0, limit - usage)
  const allowed = remaining > 0

  return {
    allowed,
    remaining,
    limit,
    plan
  }
}

