import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const searchParams = req.nextUrl.searchParams
    const category = searchParams.get('category')
    const isPublic = searchParams.get('public') === 'true'

    const where: any = {}
    
    if (isPublic) {
      where.isPublic = true
    } else if (session?.user?.id) {
      where.userId = session.user.id
    } else {
      where.isPublic = true
    }

    if (category) {
      where.category = category
    }

    if (!(prisma as any).template) {
      console.error('Template delegate missing on Prisma client', Object.keys(prisma))
      throw new Error('Template model is not available in Prisma Client. Run `npx prisma generate` and restart the dev server.')
    }

    const templates = await prisma.template.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: [
        { downloads: 'desc' },
        { rating: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 50
    })

    return NextResponse.json({ templates })
  } catch (error: any) {
    console.error('Templates fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, description, category, content, isPublic, isPremium, price, tags } = await req.json()

    if (!name || !category || !content) {
      return NextResponse.json(
        { error: 'Name, category, and content are required' },
        { status: 400 }
      )
    }

    if (!(prisma as any).template) {
      console.error('Template delegate missing on Prisma client', Object.keys(prisma))
      throw new Error('Template model is not available in Prisma Client. Run `npx prisma generate` and restart the dev server.')
    }

    const normalizedTags =
      Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((tag) => tag.trim()).filter(Boolean) : []

    const template = await prisma.template.create({
      data: {
        userId: session.user.id,
        name,
        description,
        category,
        content,
        isPublic: !!isPublic,
        isPremium: !!isPremium,
        price: isPremium ? Number(price) || 0 : 0,
        tags: normalizedTags
      }
    })

    return NextResponse.json({ template })
  } catch (error: any) {
    console.error('Template creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create template' },
      { status: 500 }
    )
  }
}

