import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get or create referral code
    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { referralCode: true, affiliateEarnings: true }
    })

    if (!user?.referralCode) {
      const code = `KUKI-${nanoid(8).toUpperCase()}`
      user = await prisma.user.update({
        where: { id: session.user.id },
        data: { referralCode: code },
        select: { referralCode: true, affiliateEarnings: true }
      })
    }

    // Get referral stats
    const referrals = await prisma.referral.findMany({
      where: { referrerId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    // Get referred user details separately
    const referralsWithUsers = await Promise.all(
      referrals.map(async (ref) => {
        const referredUser = await prisma.user.findUnique({
          where: { id: ref.referredId },
          select: { name: true, email: true, createdAt: true }
        })
        return {
          ...ref,
          referred: referredUser
        }
      })
    )

    return NextResponse.json({
      referralCode: user?.referralCode,
      earnings: user?.affiliateEarnings || 0,
      referrals: referralsWithUsers,
      referralLink: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/register?ref=${user?.referralCode}`
    })
  } catch (error: any) {
    console.error('Referral fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch referral info' },
      { status: 500 }
    )
  }
}
