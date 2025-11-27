import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { postToMultiplePlatforms, PostData } from '@/lib/integrations'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content, title, platforms, tags, status, publishDate } = await req.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    if (!platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'At least one platform is required' },
        { status: 400 }
      )
    }

    // Get user's platform credentials from database
    // For now, we'll use the credentials from the request
    // In production, store these securely in the database

    const postData: PostData = {
      title,
      content,
      tags,
      status: status || 'draft',
      publishDate: publishDate ? new Date(publishDate) : undefined
    }

    const results = await postToMultiplePlatforms(postData, platforms)

    // Save posting history
    await prisma.generation.create({
      data: {
        userId: session.user.id,
        type: 'AUTO_POST',
        input: JSON.stringify({ platforms, postData }),
        output: JSON.stringify(results)
      }
    })

    return NextResponse.json({
      success: true,
      results
    })
  } catch (error: any) {
    console.error('Auto-posting error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to post content' },
      { status: 500 }
    )
  }
}

