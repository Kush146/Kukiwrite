import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getCurrentUser } from '@/lib/session'
import { getUserUsageThisPeriod, getUserPlan } from '@/lib/usage'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { UsageBar } from '@/components/ui/UsageBar'
import { RateLimitDisplay } from '@/components/ui/RateLimitDisplay'
import { Button } from '@/components/ui/Button'
import { RecentGenerations } from '@/components/dashboard/RecentGenerations'
import Link from 'next/link'
import { FileText, Video, Search, RefreshCw, ArrowRight, Instagram } from 'lucide-react'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const user = await getCurrentUser()
  const usage = await getUserUsageThisPeriod(user?.id || '')
  const plan = await getUserPlan(user?.id || '')
  const limit = plan === 'PRO' ? 10000 : 50

  return (
    <div>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Welcome back{user?.name ? `, ${user.name}` : ''}!
        </h1>
        <p className="text-slate-300 text-lg">Here's what's happening with your content today.</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="hover-lift animate-fade-in group">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse-slow"></div>
              Generations This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform inline-block">
              {usage}
            </div>
            <p className="text-sm text-slate-300 mt-2">out of {limit} available</p>
          </CardContent>
        </Card>
        <Card className="hover-lift animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-slow"></div>
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {plan}
            </div>
            <p className="text-sm text-slate-300 mt-2">
              {plan === 'PRO' ? 'Unlimited access' : '50 generations/month'}
            </p>
          </CardContent>
        </Card>
        <Card className="hover-lift animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse-slow"></div>
              Remaining Quota
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {Math.max(0, limit - usage)}
            </div>
            <p className="text-sm text-slate-300 mt-2">generations left</p>
          </CardContent>
        </Card>
      </div>

          {/* Usage Bar */}
          <Card className="mb-8 animate-fade-in hover-lift" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                Usage Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UsageBar used={usage} limit={limit} plan={plan} />
            </CardContent>
          </Card>

          {/* Rate Limit Display */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.25s' }}>
            <RateLimitDisplay />
          </div>

      {/* Recent Generations */}
      <div className="mb-8">
        <RecentGenerations />
      </div>

      {/* Quick Actions */}
      <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
          Quick Actions
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Link href="/tools/blog">
            <Card className="hover-lift hover-glow cursor-pointer h-full flex flex-col group animate-fade-in">
              <CardHeader className="flex-1">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="group-hover:text-blue-400 transition-colors">Generate Blog Post</CardTitle>
                <CardDescription>Create comprehensive blog content</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="ghost" className="w-full group-hover:bg-blue-500/10 transition-all-smooth">
                  Get Started <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </Link>
          <Link href="/tools/youtube">
            <Card className="hover-lift hover-glow cursor-pointer h-full flex flex-col group animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="flex-1">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Video className="w-6 h-6 text-red-400" />
                </div>
                <CardTitle className="group-hover:text-red-400 transition-colors">Write YouTube Script</CardTitle>
                <CardDescription>Create engaging video scripts</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="ghost" className="w-full group-hover:bg-red-500/10 transition-all-smooth">
                  Get Started <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </Link>
          <Link href="/tools/seo">
            <Card className="hover-lift hover-glow cursor-pointer h-full flex flex-col group animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="flex-1">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Search className="w-6 h-6 text-green-400" />
                </div>
                <CardTitle className="group-hover:text-green-400 transition-colors">SEO Content</CardTitle>
                <CardDescription>Optimize for search engines</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="ghost" className="w-full group-hover:bg-green-500/10 transition-all-smooth">
                  Get Started <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </Link>
          <Link href="/tools/rewriter">
            <Card className="hover-lift hover-glow cursor-pointer h-full flex flex-col group animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader className="flex-1">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <RefreshCw className="w-6 h-6 text-orange-400" />
                </div>
                <CardTitle className="group-hover:text-orange-400 transition-colors">Rewrite Content</CardTitle>
                <CardDescription>Improve existing content</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="ghost" className="w-full group-hover:bg-orange-500/10 transition-all-smooth">
                  Get Started <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </Link>
          <Link href="/tools/instagram">
            <Card className="hover-lift hover-glow cursor-pointer h-full flex flex-col group animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <CardHeader className="flex-1">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Instagram className="w-6 h-6 text-pink-400" />
                </div>
                <CardTitle className="group-hover:text-pink-400 transition-colors">Instagram Content</CardTitle>
                <CardDescription>Craft captions & hashtag sets</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="ghost" className="w-full group-hover:bg-pink-500/10 transition-all-smooth">
                  Get Started <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}

