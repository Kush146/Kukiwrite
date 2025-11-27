import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const voices = await prisma.brandVoice.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ voices })
  } catch (error: any) {
    console.error('Brand voices fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch brand voices' },
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

    const { name, description, guidelines, examples, isDefault } = await req.json()

    if (!name || !guidelines) {
      return NextResponse.json(
        { error: 'Name and guidelines are required' },
        { status: 400 }
      )
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.brandVoice.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false }
      })
    }

    const voice = await prisma.brandVoice.create({
      data: {
        userId: session.user.id,
        name,
        description,
        guidelines,
        examples: examples || [],
        isDefault: isDefault || false
      }
    })

    return NextResponse.json({ voice })
  } catch (error: any) {
    console.error('Brand voice creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create brand voice' },
      { status: 500 }
    )
  }
}

