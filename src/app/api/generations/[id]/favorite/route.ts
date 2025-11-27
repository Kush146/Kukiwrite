import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { isFavorite } = await req.json()

    const generation = await prisma.generation.findUnique({
      where: { id: params.id },
      select: { userId: true }
    })

    if (!generation || generation.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.generation.update({
      where: { id: params.id },
      data: { isFavorite }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Favorite update error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update favorite' },
      { status: 500 }
    )
  }
}



