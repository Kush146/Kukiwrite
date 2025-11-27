import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    const where: any = {
      userId: session.user.id
    }

    if (type) {
      where.type = type
    }

    if (search) {
      where.OR = [
        { output: { contains: search, mode: 'insensitive' } },
        { input: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [generations, total] = await Promise.all([
      prisma.generation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          type: true,
          input: true,
          output: true,
          tags: true,
          category: true,
          isFavorite: true,
          createdAt: true
        }
      }),
      prisma.generation.count({ where })
    ])

    return NextResponse.json({
      generations,
      total,
      limit,
      offset
    })

  } catch (error: any) {
    console.error('Generations fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch generations' },
      { status: 500 }
    )
  }
}

