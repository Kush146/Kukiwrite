import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateWithAI, AIModel } from '@/lib/ai-providers'
import { canUseTool } from '@/lib/usage'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { title, topic, tone, length, model } = await req.json()

    if (!title || !topic) {
      return NextResponse.json(
        { error: 'Title and topic are required' },
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

    const prompt = `Write a comprehensive blog post with the following requirements:

Title: ${title}
Topic: ${topic}
Tone: ${tone || 'professional'}
Length: ${length || 'medium'}

Please write a well-structured blog post with an engaging introduction, clear sections, and a compelling conclusion. Make it informative and valuable for readers.`

    const response = await generateWithAI(prompt, {
      model: (model as AIModel) || 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 2000
    })

    await prisma.generation.create({
      data: {
        userId,
        type: 'BLOG',
        input: JSON.stringify({ title, topic, tone, length, model }),
        output: response.content,
        model: response.model
      }
    })

    return NextResponse.json({
      output: response.content,
      model: response.model,
      remaining: usage.remaining - 1,
      limit: usage.limit
    })
  } catch (error: any) {
    console.error('Blog generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate blog post' },
      { status: 500 }
    )
  }
}

