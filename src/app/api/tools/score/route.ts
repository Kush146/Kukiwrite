import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { scoreContent } from '@/lib/content-scoring'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content, generationId, brandVoice } = await req.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const score = await scoreContent(content, brandVoice)

    // Update generation with score if generationId provided
    if (generationId) {
      await prisma.generation.update({
        where: { id: generationId },
        data: { score: score.overall }
      })
    }

    return NextResponse.json(score)
  } catch (error: any) {
    console.error('Content scoring error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to score content' },
      { status: 500 }
    )
  }
}

