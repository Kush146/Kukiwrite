import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const teamId = params.id
    const { email, role = 'member' } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user has permission (owner or admin)
    const teamMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: session.user.id
        }
      }
    })

    if (!teamMember || !['owner', 'admin'].includes(teamMember.role)) {
      return NextResponse.json(
        { error: 'You do not have permission to invite members' },
        { status: 403 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if already a member
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: user.id
        }
      }
    })

    if (existingMember) {
      return NextResponse.json(
        { error: 'User is already a team member' },
        { status: 400 }
      )
    }

    // Add member
    const newMember = await prisma.teamMember.create({
      data: {
        teamId,
        userId: user.id,
        role: role as 'owner' | 'admin' | 'editor' | 'viewer'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({
      member: {
        id: newMember.user.id,
        name: newMember.user.name,
        email: newMember.user.email,
        image: newMember.user.image,
        role: newMember.role
      }
    })
  } catch (error: any) {
    console.error('Team invite error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to invite member' },
      { status: 500 }
    )
  }
}

