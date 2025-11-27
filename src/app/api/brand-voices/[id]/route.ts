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

    const { name, description, guidelines, examples, isDefault } = await req.json()

    // Check ownership
    const voice = await prisma.brandVoice.findUnique({
      where: { id: params.id }
    })

    if (!voice || voice.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Brand voice not found' },
        { status: 404 }
      )
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.brandVoice.updateMany({
        where: { userId: session.user.id, isDefault: true, id: { not: params.id } },
        data: { isDefault: false }
      })
    }

    const updated = await prisma.brandVoice.update({
      where: { id: params.id },
      data: {
        name,
        description,
        guidelines,
        examples: examples || [],
        isDefault: isDefault || false
      }
    })

    return NextResponse.json({ voice: updated })
  } catch (error: any) {
    console.error('Brand voice update error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update brand voice' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const voice = await prisma.brandVoice.findUnique({
      where: { id: params.id }
    })

    if (!voice || voice.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Brand voice not found' },
        { status: 404 }
      )
    }

    await prisma.brandVoice.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Brand voice deletion error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete brand voice' },
      { status: 500 }
    )
  }
}

