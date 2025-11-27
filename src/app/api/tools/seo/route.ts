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
    const { keyword, targetAudience, contentType, competitors } = await req.json()

    if (!keyword) {
      return NextResponse.json(
        { error: 'Keyword is required' },
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

    const prompt = `Create an SEO-optimized content strategy and outline for the following:

Primary Keyword: ${keyword}
Target Audience: ${targetAudience || 'general audience'}
Content Type: ${contentType || 'blog post'}
Competitors: ${competitors || 'none specified'}

Please provide:
1. SEO-optimized title suggestions (3-5 options)
2. Meta description (2-3 options)
3. H1, H2, H3 heading structure
4. Target keyword density and placement recommendations
5. Related keywords and LSI terms
6. Content outline with SEO best practices
7. Internal linking suggestions
8. Call-to-action recommendations

Make it comprehensive and actionable for SEO success.`

    const output = await generateContent(prompt)

    await prisma.generation.create({
      data: {
        userId,
        type: 'SEO',
        input: JSON.stringify({ keyword, targetAudience, contentType, competitors }),
        output
      }
    })

    return NextResponse.json({
      output,
      remaining: usage.remaining - 1,
      limit: usage.limit
    })
  } catch (error: any) {
    console.error('SEO generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate SEO content' },
      { status: 500 }
    )
  }
}

