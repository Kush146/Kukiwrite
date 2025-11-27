'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CopyButton } from '@/components/ui/CopyButton'
import { ExportMenu } from '@/components/ui/ExportMenu'
import { Skeleton, TextSkeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/Toast'
import { Search, Trash2, FileText, Video, Search as SearchIcon, RefreshCw, Instagram, Download, Star, Tag, Filter, X } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const typeIcons = {
  BLOG: FileText,
  YOUTUBE: Video,
  SEO: SearchIcon,
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

interface Generation {
  id: string
  type: string
  input: string
  output: string
  tags?: string[]
  category?: string | null
  isFavorite?: boolean
  createdAt: string
}

export default function HistoryPage() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [favoriteFilter, setFavoriteFilter] = useState(false)
  const [tagFilter, setTagFilter] = useState<string>('')
  const [editingTags, setEditingTags] = useState<string | null>(null)
  const [newTag, setNewTag] = useState('')
  const { showToast } = useToast()

  useEffect(() => {
    fetchGenerations()
  }, [search, typeFilter])

  const fetchGenerations = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (typeFilter) params.append('type', typeFilter)
      params.append('limit', '100')

      const response = await fetch(`/api/generations?${params}`)
      if (response.ok) {
        const data = await response.json()
        let filtered = data.generations || []
        if (favoriteFilter) {
          filtered = filtered.filter((g: Generation) => g.isFavorite)
        }
        if (tagFilter) {
          filtered = filtered.filter((g: Generation) => 
            g.tags?.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase()))
          )
        }
        setGenerations(filtered)
      }
    } catch (error) {
      showToast('Failed to load history', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFavorite = async (id: string, current: boolean) => {
    try {
      const response = await fetch(`/api/generations/${id}/favorite`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !current })
      })

      if (response.ok) {
        setGenerations(generations.map(g => 
          g.id === id ? { ...g, isFavorite: !current } : g
        ))
        showToast(!current ? 'Added to favorites' : 'Removed from favorites', 'success')
      }
    } catch (error) {
      showToast('Failed to update favorite', 'error')
    }
  }

  const handleAddTag = async (id: string, tag: string) => {
    if (!tag.trim()) return
    
    const generation = generations.find(g => g.id === id)
    if (!generation) return

    const newTags = [...(generation.tags || []), tag.trim()]
    
    try {
      const response = await fetch(`/api/generations/${id}/tags`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: newTags })
      })

      if (response.ok) {
        setGenerations(generations.map(g => 
          g.id === id ? { ...g, tags: newTags } : g
        ))
        setNewTag('')
        setEditingTags(null)
        showToast('Tag added', 'success')
      }
    } catch (error) {
      showToast('Failed to add tag', 'error')
    }
  }

  const handleRemoveTag = async (id: string, tagToRemove: string) => {
    const generation = generations.find(g => g.id === id)
    if (!generation) return

    const newTags = (generation.tags || []).filter(t => t !== tagToRemove)
    
    try {
      const response = await fetch(`/api/generations/${id}/tags`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: newTags })
      })

      if (response.ok) {
        setGenerations(generations.map(g => 
          g.id === id ? { ...g, tags: newTags } : g
        ))
        showToast('Tag removed', 'success')
      }
    } catch (error) {
      showToast('Failed to remove tag', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this generation?')) return

    try {
      const response = await fetch(`/api/generations/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setGenerations(generations.filter((g) => g.id !== id))
        showToast('Generation deleted', 'success')
      } else {
        showToast('Failed to delete', 'error')
      }
    } catch (error) {
      showToast('Failed to delete', 'error')
    }
  }

  const handleDownload = (generation: Generation) => {
    const blob = new Blob([generation.output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${typeLabels[generation.type as keyof typeof typeLabels] || 'content'}-${generation.id.slice(0, 8)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Download started', 'success')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Content History</h1>
        <p className="text-slate-300">View and manage your generated content</p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search content..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="flex h-10 rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
              >
                <option value="">All Types</option>
                {Object.entries(typeLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <Button
                variant={favoriteFilter ? 'default' : 'outline'}
                onClick={() => setFavoriteFilter(!favoriteFilter)}
              >
                <Star className={`w-4 h-4 mr-2 ${favoriteFilter ? 'fill-yellow-400' : ''}`} />
                Favorites
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-slate-400" />
              <Input
                placeholder="Filter by tag..."
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="flex-1"
              />
              {(tagFilter || favoriteFilter) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setTagFilter('')
                    setFavoriteFilter(false)
                  }}
                >
                  <X className="w-4 h-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <TextSkeleton lines={4} />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : generations.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-slate-400 mb-4">No generations found</p>
            <p className="text-sm text-slate-500">
              {search || typeFilter
                ? 'Try adjusting your search or filters'
                : 'Start generating content to see it here'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {generations.map((generation) => {
            const Icon = typeIcons[generation.type as keyof typeof typeIcons] || FileText
            const label = typeLabels[generation.type as keyof typeof typeLabels] || generation.type

            return (
              <Card key={generation.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-blue-400" />
                      <div>
                        <CardTitle className="text-lg">{label}</CardTitle>
                        <CardDescription>
                          {formatDistanceToNow(new Date(generation.createdAt), { addSuffix: true })}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <CopyButton text={generation.output} variant="outline" size="sm" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(generation)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(generation.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-400 mb-2">Input:</p>
                      <p className="text-sm text-slate-300 bg-slate-900/50 p-3 rounded">
                        {JSON.parse(generation.input).title || JSON.parse(generation.input).topic || generation.input.substring(0, 200)}
                        {generation.input.length > 200 && '...'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-2">Output:</p>
                      <pre className="text-sm text-slate-200 bg-slate-900/50 p-3 rounded whitespace-pre-wrap max-h-96 overflow-y-auto">
                        {generation.output}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

