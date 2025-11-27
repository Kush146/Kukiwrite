import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'
import { OnboardingTour } from '@/components/onboarding/OnboardingTour'
import { getCurrentUser } from '@/lib/session'

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const user = await getCurrentUser()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100 transition-colors flex flex-col">
      <OnboardingTour />
      <AppSidebar />
      <TopNav user={user || undefined} />
      <main className="ml-0 md:ml-64 pt-16 flex-1 flex flex-col animate-fade-in">
        <div className="p-4 md:p-8 flex-1">{children}</div>
        <Footer />
      </main>
    </div>
  )
}

