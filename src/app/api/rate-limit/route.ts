import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Simulated rate limit - in production, use Redis or similar
const RATE_LIMITS = {
  FREE: { limit: 50, window: 'day' },
  PRO: { limit: 1000, window: 'hour' }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // In a real implementation, you'd check actual rate limits from Redis/database
    // For now, we'll simulate based on usage
    const plan = 'FREE' // Get from user subscription
    const limit = RATE_LIMITS[plan].limit
    const window = RATE_LIMITS[plan].window

    // Calculate reset time
    const now = new Date()
    let resetAt = new Date()
    
    if (window === 'minute') {
      resetAt.setMinutes(now.getMinutes() + 1)
      resetAt.setSeconds(0)
    } else if (window === 'hour') {
      resetAt.setHours(now.getHours() + 1)
      resetAt.setMinutes(0)
      resetAt.setSeconds(0)
    } else {
      resetAt.setDate(now.getDate() + 1)
      resetAt.setHours(0)
      resetAt.setMinutes(0)
      resetAt.setSeconds(0)
    }

    // Simulate remaining requests (in production, track actual usage)
    const remaining = Math.max(0, limit - 10) // Placeholder

    return NextResponse.json({
      remaining,
      limit,
      resetAt: resetAt.toISOString(),
      window
    })
  } catch (error: any) {
    console.error('Rate limit fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch rate limit' },
      { status: 500 }
    )
  }
}



