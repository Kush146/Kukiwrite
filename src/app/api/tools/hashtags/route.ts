import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateContent } from '@/lib/openai'
import { canUseTool } from '@/lib/usage'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { topic, platform } = await req.json()

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    const usage = await canUseTool(userId)

    if (!usage.allowed) {
      return NextResponse.json(
        {
          error: 'Usage limit exceeded',
          remaining: usage.remaining,
          limit: usage.limit,
          plan: usage.plan
        },
        { status: 403 }
      )
    }

    const prompt = `Generate relevant hashtags for ${platform} based on this topic: "${topic}"

    Requirements:
    - Generate 15-30 relevant hashtags
    - Mix of popular and niche hashtags
    - Platform-appropriate (${platform})
    - Include trending and evergreen hashtags
    - Format: one hashtag per line, starting with #
    - No explanations, just hashtags`

    const output = await generateContent(prompt)
    const hashtags = output.split('\n').filter(line => line.trim().startsWith('#')).join('\n')

    await prisma.generation.create({
      data: {
        userId,
        type: 'HASHTAGS',
        input: JSON.stringify({ topic, platform }),
        output: hashtags
      }
    })

    return NextResponse.json({
      hashtags,
      remaining: usage.remaining - 1,
      limit: usage.limit
    })
  } catch (error: any) {
    console.error('Hashtag generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate hashtags' },
      { status: 500 }
    )
  }
}



