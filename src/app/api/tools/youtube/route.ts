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
    const { topic, duration, style, includeIntro, includeOutro } = await req.json()

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

    const prompt = `Write a YouTube video script with the following requirements:

Topic: ${topic}
Duration: ${duration || '10 minutes'}
Style: ${style || 'engaging and conversational'}
Include Intro: ${includeIntro !== false}
Include Outro: ${includeIntro !== false}

Please create a complete script with:
- Hook/Introduction (if requested)
- Main content sections with clear talking points
- Transitions between sections
- Call-to-action and outro (if requested)
- Timestamps for key sections

Make it engaging, natural, and optimized for YouTube viewers.`

    const output = await generateContent(prompt)

    await prisma.generation.create({
      data: {
        userId,
        type: 'YOUTUBE',
        input: JSON.stringify({ topic, duration, style, includeIntro, includeOutro }),
        output
      }
    })

    return NextResponse.json({
      output,
      remaining: usage.remaining - 1,
      limit: usage.limit
    })
  } catch (error: any) {
    console.error('YouTube script generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate YouTube script' },
      { status: 500 }
    )
  }
}

