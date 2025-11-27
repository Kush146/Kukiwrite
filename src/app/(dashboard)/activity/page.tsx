'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'
import { Activity, FileText, Video, Search, RefreshCw, Instagram, Hash, CheckCircle, Clock, User } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

interface ActivityItem {
  id: string
  type: 'generation' | 'favorite' | 'tag' | 'export' | 'delete' | 'update'
  action: string
  content: string
  timestamp: Date
  icon: any
  color: string
}

const activityIcons = {
  generation: FileText,
  favorite: CheckCircle,
  tag: Hash,
  export: FileText,
  delete: RefreshCw,
  update: RefreshCw
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    setLoading(true)
    try {
      // Load from localStorage (in production, fetch from API)
      const stored = localStorage.getItem('kukiwrite_activity')
      if (stored) {
        setActivities(JSON.parse(stored).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })))
      }

      // Also fetch recent generations as activity
      const response = await fetch('/api/generations?limit=20')
      if (response.ok) {
        const data = await response.json()
        const generationActivities: ActivityItem[] = (data.generations || []).map((gen: any) => ({
          id: gen.id,
          type: 'generation' as const,
          action: `Generated ${getTypeLabel(gen.type)}`,
          content: JSON.parse(gen.input).title || JSON.parse(gen.input).topic || 'Content',
          timestamp: new Date(gen.createdAt),
          icon: activityIcons.generation,
          color: 'text-blue-400'
        }))
        
        // Merge and sort by timestamp
        const allActivities = [...activities, ...generationActivities]
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, 50)
        
        setActivities(allActivities)
        localStorage.setItem('kukiwrite_activity', JSON.stringify(allActivities))
      }
    } catch (error) {
      console.error('Failed to load activities:', error)
      showToast('Failed to load activity feed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      BLOG: 'Blog Post',
      YOUTUBE: 'YouTube Script',
      SEO: 'SEO Content',
      INSTAGRAM: 'Instagram Content',
      REWRITER: 'Content Rewriter',
      GRAMMAR_CHECK: 'Grammar Check',
      HASHTAGS: 'Hashtags'
    }
    return labels[type] || type
  }

  const groupByDate = (items: ActivityItem[]) => {
    const groups: Record<string, ActivityItem[]> = {}
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    items.forEach(item => {
      let groupKey: string
      if (isSameDay(item.timestamp, today)) {
        groupKey = 'Today'
      } else if (isSameDay(item.timestamp, yesterday)) {
        groupKey = 'Yesterday'
      } else {
        groupKey = format(item.timestamp, 'MMMM d, yyyy')
      }

      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(item)
    })

    return groups
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear()
  }

  const groupedActivities = groupByDate(activities)

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Activity Feed</h1>
          <p className="text-slate-300">Your recent activity and content generation history</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-slate-500 py-12">Loading activities...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Activity className="w-8 h-8 text-blue-400" />
          Activity Feed
        </h1>
        <p className="text-slate-300">Your recent activity and content generation history</p>
      </div>

      {activities.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-slate-500 py-12">
              <Activity className="w-12 h-12 mx-auto mb-4 text-slate-600" />
              <p>No activity yet</p>
              <p className="text-sm text-slate-400 mt-2">Start generating content to see your activity here</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedActivities).map(([date, items]) => (
            <Card key={date}>
              <CardHeader>
                <CardTitle className="text-lg">{date}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((activity) => {
                    const Icon = activity.icon || Activity
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-900/50 transition-colors"
                      >
                        <div className={`w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-200">{activity.action}</p>
                          <p className="text-sm text-slate-400 truncate">{activity.content}</p>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}



