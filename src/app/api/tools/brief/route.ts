import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateWithAI } from '@/lib/ai-providers'
import { canUseTool } from '@/lib/usage'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { topic, targetAudience, goals, format, tone } = await req.json()

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

    const prompt = `Create a comprehensive content brief for the following topic:

Topic: ${topic}
Target Audience: ${targetAudience || 'general audience'}
Content Goals: ${goals || 'inform and engage'}
Format: ${format || 'blog post'}
Tone: ${tone || 'professional'}

Please provide:
1. Executive Summary
2. Target Audience Analysis
3. Key Messages & Talking Points
4. Content Outline/Structure
5. SEO Keywords & Phrases
6. Research Sources & References
7. Call-to-Action Suggestions
8. Success Metrics
9. Timeline & Milestones
10. Content Requirements & Guidelines

Make it detailed, actionable, and ready for content creation.`

    const response = await generateWithAI(prompt, {
      model: 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 3000
    })

    await prisma.generation.create({
      data: {
        userId,
        type: 'BRIEF',
        input: JSON.stringify({ topic, targetAudience, goals, format, tone }),
        output: response.content,
        model: response.model
      }
    })

    return NextResponse.json({
      output: response.content,
      remaining: usage.remaining - 1,
      limit: usage.limit
    })
  } catch (error: any) {
    console.error('Brief generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate content brief' },
      { status: 500 }
    )
  }
}

