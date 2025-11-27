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

    // Get teams where user is a member
    const teamMembers = await prisma.teamMember.findMany({
      where: { userId: session.user.id },
      include: {
        team: {
          include: {
            members: {
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
            },
            _count: {
              select: { generations: true }
            }
          }
        }
      }
    })

    const teams = teamMembers.map(tm => ({
      id: tm.team.id,
      name: tm.team.name,
      description: tm.team.description,
      role: tm.role,
      memberCount: tm.team.members.length,
      contentCount: tm.team._count.generations,
      createdAt: tm.team.createdAt,
      members: tm.team.members.map(m => ({
        id: m.user.id,
        name: m.user.name,
        email: m.user.email,
        image: m.user.image,
        role: m.role
      }))
    }))

    return NextResponse.json({ teams })
  } catch (error: any) {
    console.error('Teams fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch teams' },
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

    const { name, description } = await req.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Team name is required' },
        { status: 400 }
      )
    }

    // Create team with owner as first member
    const team = await prisma.team.create({
      data: {
        name,
        description,
        ownerId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: 'owner'
          }
        }
      },
      include: {
        members: {
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
        }
      }
    })

    return NextResponse.json({
      team: {
        id: team.id,
        name: team.name,
        description: team.description,
        role: 'owner',
        memberCount: team.members.length,
        members: team.members.map(m => ({
          id: m.user.id,
          name: m.user.name,
          email: m.user.email,
          image: m.user.image,
          role: m.role
        }))
      }
    })
  } catch (error: any) {
    console.error('Team creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create team' },
      { status: 500 }
    )
  }
}

