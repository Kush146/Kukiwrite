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
    const { campaign, offer, tone, hashtags, postType } = await req.json()

    if (!campaign || !offer) {
      return NextResponse.json(
        { error: 'Campaign and offer details are required' },
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

    const prompt = `Create an on-brand Instagram ${postType || 'caption'} for the following campaign.

Campaign focus: ${campaign}
Offer/product details: ${offer}
Tone: ${tone || 'friendly and engaging'}
Hashtags to include: ${hashtags || '3-5 relevant hashtags'}

Please provide:
1. A hook/opening line that grabs attention.
2. A concise body copy with emojis where appropriate.
3. A call-to-action that drives engagement or conversions.
4. Suggested hashtags (list form).
5. If relevant, suggest carousel slide ideas or short reel script cues.

Make it optimized for Instagram best practices and keep it authentic.`.trim()

    const output = await generateContent(prompt)

    await prisma.generation.create({
      data: {
        userId,
        type: 'INSTAGRAM',
        input: JSON.stringify({ campaign, offer, tone, hashtags, postType }),
        output
      }
    })

    return NextResponse.json({
      output,
      remaining: usage.remaining - 1,
      limit: usage.limit
    })
  } catch (error: any) {
    console.error('Instagram generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate Instagram content' },
      { status: 500 }
    )
  }
}




