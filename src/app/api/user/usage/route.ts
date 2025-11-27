import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserUsageThisPeriod, getUserPlan } from '@/lib/usage'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const usage = await getUserUsageThisPeriod(userId)
    const plan = await getUserPlan(userId)
    const limit = plan === 'PRO' ? 10000 : 50

    return NextResponse.json({
      usage,
      limit,
      plan
    })
  } catch (error: any) {
    console.error('Usage fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch usage' },
      { status: 500 }
    )
  }
}

