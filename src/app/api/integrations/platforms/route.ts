import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's connected platforms from database
    // For now, return available platforms
    const platforms = [
      {
        id: 'wordpress',
        name: 'WordPress',
        icon: '📝',
        connected: false,
        authUrl: '/api/integrations/wordpress/auth'
      },
      {
        id: 'medium',
        name: 'Medium',
        icon: '✍️',
        connected: false,
        authUrl: '/api/integrations/medium/auth'
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: '💼',
        connected: false,
        authUrl: '/api/integrations/linkedin/auth'
      },
      {
        id: 'twitter',
        name: 'Twitter/X',
        icon: '🐦',
        connected: false,
        authUrl: '/api/integrations/twitter/auth'
      }
    ]

    return NextResponse.json({ platforms })
  } catch (error: any) {
    console.error('Platforms fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch platforms' },
      { status: 500 }
    )
  }
}

