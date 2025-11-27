import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { translateContent, translateToMultipleLanguages } from '@/lib/translation'
import { canUseTool } from '@/lib/usage'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { content, targetLanguage, sourceLanguage, options, multipleLanguages } = await req.json()

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

    let result: string | Record<string, string>

    if (multipleLanguages && Array.isArray(multipleLanguages)) {
      result = await translateToMultipleLanguages(
        content,
        multipleLanguages,
        sourceLanguage || 'en',
        options || {}
      )
    } else {
      result = await translateContent(
        content,
        targetLanguage || 'es',
        sourceLanguage || 'en',
        options || {}
      )
    }

    await prisma.generation.create({
      data: {
        userId,
        type: 'TRANSLATION',
        input: JSON.stringify({ content, targetLanguage, sourceLanguage, options }),
        output: typeof result === 'string' ? result : JSON.stringify(result)
      }
    })

    return NextResponse.json({
      translation: result,
      remaining: usage.remaining - 1,
      limit: usage.limit
    })
  } catch (error: any) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to translate content' },
      { status: 500 }
    )
  }
}

