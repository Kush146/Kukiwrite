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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        headline: true,
        bio: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error: any) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, image, phone, headline, bio } = await req.json()

    // Check if user exists first
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found. Please sign out and sign in again.' },
        { status: 404 }
      )
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        image,
        phone,
        headline,
        bio
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        headline: true,
        bio: true
      }
    })

    return NextResponse.json(user)
  } catch (error: any) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    )
  }
}

