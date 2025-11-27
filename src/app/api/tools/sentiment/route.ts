import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { analyzeToneAndSentiment } from '@/lib/sentiment'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content } = await req.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const analysis = await analyzeToneAndSentiment(content)

    return NextResponse.json(analysis)
  } catch (error: any) {
    console.error('Sentiment analysis error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to analyze sentiment' },
      { status: 500 }
    )
  }
}

