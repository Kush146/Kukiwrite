import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'
import crypto from 'crypto'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has Pro plan
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'active',
        currentPeriodEnd: {
          gte: new Date()
        }
      }
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'API access requires Pro plan' },
        { status: 403 }
      )
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        name: true,
        key: true,
        lastUsed: true,
        createdAt: true,
        expiresAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Mask keys for display (show only last 8 characters)
    const maskedKeys = apiKeys.map(key => ({
      ...key,
      key: key.key ? `kuki_${key.key.slice(-8)}` : null
    }))

    return NextResponse.json({ apiKeys: maskedKeys })
  } catch (error: any) {
    console.error('API keys fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch API keys' },
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

    // Check if user has Pro plan
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'active',
        currentPeriodEnd: {
          gte: new Date()
        }
      }
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'API access requires Pro plan' },
        { status: 403 }
      )
    }

    const { name, expiresInDays } = await req.json()

    if (!name) {
      return NextResponse.json(
        { error: 'API key name is required' },
        { status: 400 }
      )
    }

    // Generate API key
    const keyPrefix = 'kuki_'
    const keySuffix = nanoid(32)
    const fullKey = `${keyPrefix}${keySuffix}`

    // Hash the key for storage
    const hashedKey = crypto.createHash('sha256').update(fullKey).digest('hex')

    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null

    const apiKey = await prisma.apiKey.create({
      data: {
        userId: session.user.id,
        name,
        key: hashedKey, // Store hashed version
        expiresAt
      }
    })

    // Return the full key only once (client should save it)
    return NextResponse.json({
      apiKey: {
        id: apiKey.id,
        name: apiKey.name,
        key: fullKey, // Return full key for initial display
        createdAt: apiKey.createdAt,
        expiresAt: apiKey.expiresAt
      },
      warning: 'Save this key now. You won\'t be able to see it again!'
    })
  } catch (error: any) {
    console.error('API key creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create API key' },
      { status: 500 }
    )
  }
}

