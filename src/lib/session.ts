import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { prisma } from './prisma'

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true
    }
  })

  return user
}

