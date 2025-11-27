'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import Link from 'next/link'
import { FileText, Video, Search, RefreshCw, Instagram, ArrowRight, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const typeIcons = {
  BLOG: FileText,
  YOUTUBE: Video,
  SEO: Search,
  REWRITER: RefreshCw,
  INSTAGRAM: Instagram
}

const typeLabels = {
  BLOG: 'Blog Post',
  YOUTUBE: 'YouTube Script',
  SEO: 'SEO Content',
  REWRITER: 'Content Rewriter',
  INSTAGRAM: 'Instagram Content'
}

const typeRoutes = {
  BLOG: '/tools/blog',
  YOUTUBE: '/tools/youtube',
  SEO: '/tools/seo',
  REWRITER: '/tools/rewriter',
  INSTAGRAM: '/tools/instagram'
}

interface Generation {
  id: string
  type: string
  input: string
  output: string
  createdAt: string
}

export function RecentGenerations() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentGenerations()
  }, [])

  const fetchRecentGenerations = async () => {
    try {
      const response = await fetch('/api/generations?limit=5')
      if (response.ok) {
        const data = await response.json()
        setGenerations(data.generations || [])
      }
    } catch (error) {
      console.error('Failed to fetch recent generations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Generations</CardTitle>
          <CardDescription>Your latest AI-generated content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (generations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Generations</CardTitle>
          <CardDescription>Your latest AI-generated content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-slate-400 mb-2">No generations yet</p>
            <p className="text-sm text-slate-500">Start creating content to see it here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover-lift animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              Recent Generations
            </CardTitle>
            <CardDescription>Your latest AI-generated content</CardDescription>
          </div>
          <Link href="/history">
            <Button variant="ghost" size="sm" className="group">
              View All <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {generations.map((generation) => {
            const Icon = typeIcons[generation.type as keyof typeof typeIcons] || FileText
            const label = typeLabels[generation.type as keyof typeof typeLabels] || generation.type
            const route = typeRoutes[generation.type as keyof typeof typeRoutes] || '/tools/blog'
            
            let preview = ''
            try {
              const inputData = JSON.parse(generation.input)
              preview = inputData.title || inputData.topic || inputData.campaign || generation.input.substring(0, 60)
            } catch {
              preview = generation.input.substring(0, 60)
            }
            if (preview.length > 60) preview += '...'

            return (
              <Link
                key={generation.id}
                href={route}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-900/50 transition-all-smooth group hover:scale-[1.02]"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:scale-110 transition-all-smooth">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{label}</p>
                  <p className="text-xs text-slate-400 truncate">{preview}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>{formatDistanceToNow(new Date(generation.createdAt), { addSuffix: true })}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

