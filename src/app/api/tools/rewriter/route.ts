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
    const { content, tone, style, purpose } = await req.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
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

    const prompt = `Rewrite the following content with these requirements:

Original Content:
${content}

Tone: ${tone || 'maintain original tone'}
Style: ${style || 'professional'}
Purpose: ${purpose || 'improve clarity and engagement'}

Please rewrite the content to:
- Improve clarity and readability
- Maintain the core message and meaning
- Enhance engagement and flow
- Apply the requested tone and style
- Optimize for the specified purpose

Provide only the rewritten content without additional commentary.`

    const output = await generateContent(prompt)

    await prisma.generation.create({
      data: {
        userId,
        type: 'REWRITER',
        input: JSON.stringify({ content, tone, style, purpose }),
        output
      }
    })

    return NextResponse.json({
      output,
      remaining: usage.remaining - 1,
      limit: usage.limit
    })
  } catch (error: any) {
    console.error('Content rewriting error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to rewrite content' },
      { status: 500 }
    )
  }
}

