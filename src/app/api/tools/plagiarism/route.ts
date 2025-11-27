import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkPlagiarismWithAPI } from '@/lib/plagiarism'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content } = await req.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const result = await checkPlagiarismWithAPI(content)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Plagiarism check error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check plagiarism' },
      { status: 500 }
    )
  }
}

