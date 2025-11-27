'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { FileText, Video, Search, RefreshCw, Instagram, TrendingUp, Calendar, BarChart3 } from 'lucide-react'

interface Analytics {
  totalGenerations: number
  generationsByType: Record<string, number>
  generationsThisWeek: number
  generationsThisMonth: number
  mostUsedTool: string
  averagePerDay: number
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/generations?limit=1000')
      if (response.ok) {
        const data = await response.json()
        const generations = data.generations || []

        const byType: Record<string, number> = {}
        const now = new Date()
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

        let thisWeek = 0
        let thisMonth = 0

        generations.forEach((gen: any) => {
          const date = new Date(gen.createdAt)
          byType[gen.type] = (byType[gen.type] || 0) + 1

          if (date >= weekAgo) thisWeek++
          if (date >= monthAgo) thisMonth++
        })

        const mostUsed = Object.entries(byType).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
        const avgPerDay = thisMonth / 30

        setAnalytics({
          totalGenerations: generations.length,
          generationsByType: byType,
          generationsThisWeek: thisWeek,
          generationsThisMonth: thisMonth,
          mostUsedTool: mostUsed,
          averagePerDay: Math.round(avgPerDay * 10) / 10
        })
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const typeLabels: Record<string, string> = {
    BLOG: 'Blog Post',
    YOUTUBE: 'YouTube Script',
    SEO: 'SEO Content',
    REWRITER: 'Content Rewriter',
    INSTAGRAM: 'Instagram Content'
  }

  const typeIcons: Record<string, any> = {
    BLOG: FileText,
    YOUTUBE: Video,
    SEO: Search,
    REWRITER: RefreshCw,
    INSTAGRAM: Instagram
  }

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-slate-300">Track your content generation activity</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-slate-300">Track your content generation activity</p>
        </div>
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-slate-400">No analytics data available</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-slate-300">Track your content generation activity</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Total Generations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalGenerations}</div>
            <p className="text-sm text-slate-300 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-400" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.generationsThisWeek}</div>
            <p className="text-sm text-slate-300 mt-1">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.generationsThisMonth}</div>
            <p className="text-sm text-slate-300 mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Per Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.averagePerDay}</div>
            <p className="text-sm text-slate-300 mt-1">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Most Used Tool</CardTitle>
            <CardDescription>Your favorite content generation tool</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.mostUsedTool !== 'N/A' ? (
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = typeIcons[analytics.mostUsedTool] || FileText
                  return <Icon className="w-8 h-8 text-blue-400" />
                })()}
                <div>
                  <p className="text-xl font-semibold">
                    {typeLabels[analytics.mostUsedTool] || analytics.mostUsedTool}
                  </p>
                  <p className="text-sm text-slate-400">
                    {analytics.generationsByType[analytics.mostUsedTool]} generations
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-slate-400">No data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage by Tool</CardTitle>
            <CardDescription>Breakdown of your content generation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.generationsByType)
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => {
                  const Icon = typeIcons[type] || FileText
                  const percentage = (count / analytics.totalGenerations) * 100
                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-medium">
                            {typeLabels[type] || type}
                          </span>
                        </div>
                        <span className="text-sm text-slate-400">{count}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

