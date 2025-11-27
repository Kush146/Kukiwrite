'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/components/ui/Toast'
import { Layers, Plus, Star, Download, Loader2, Search } from 'lucide-react'

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'community' | 'mine'>('community')
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: 'blog',
    content: '',
    isPublic: false,
    tags: ''
  })

  const { showToast } = useToast()

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'blog', name: 'Blog Posts' },
    { id: 'social', name: 'Social Media' },
    { id: 'email', name: 'Email' },
    { id: 'product', name: 'Product Descriptions' },
    { id: 'seo', name: 'SEO Content' }
  ]

  useEffect(() => {
    fetchTemplates()
  }, [selectedCategory, viewMode])

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') {
        params.set('category', selectedCategory)
      }
      if (viewMode === 'community') {
        params.set('public', 'true')
      }

      const query = params.toString()
      const url = `/api/templates${query ? `?${query}` : ''}`

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates || [])
      } else {
        if (response.status === 401 && viewMode === 'mine') {
          showToast('Sign in to view your private templates.', 'error')
          setViewMode('community')
        } else {
          showToast('Failed to load templates', 'error')
        }
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error)
      showToast('Failed to load templates', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTemplate = async () => {
    if (!newTemplate.name || !newTemplate.content) {
      showToast('Name and content are required', 'error')
      return
    }

    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTemplate,
          tags: newTemplate.tags.split(',').map(t => t.trim()).filter(Boolean)
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create template')
      }

      showToast('Template created successfully!', 'success')
      setShowCreateModal(false)
      setNewTemplate({
        name: '',
        description: '',
        category: 'blog',
        content: '',
        isPublic: false,
        tags: ''
      })
      setViewMode('mine')
      setTimeout(() => fetchTemplates(), 300)
    } catch (error: any) {
      showToast(error.message || 'Failed to create template', 'error')
    }
  }

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Template Marketplace
          </h1>
          <p className="text-slate-300">
            Discover and share content templates
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="inline-flex rounded-lg border border-slate-800 overflow-hidden w-full md:w-auto">
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === 'community' ? 'bg-blue-500/20 text-blue-300' : 'text-slate-400 hover:text-white'
            }`}
            onClick={() => setViewMode('community')}
          >
            Community Templates
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === 'mine' ? 'bg-blue-500/20 text-blue-300' : 'text-slate-400 hover:text-white'
            }`}
            onClick={() => setViewMode('mine')}
          >
            My Templates
          </button>
        </div>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="pl-10 bg-slate-800 border-slate-700"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl my-8">
            <CardHeader>
              <CardTitle>Create Template</CardTitle>
              <CardDescription>Share your template with the community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Template Name *</label>
                <Input
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  placeholder="e.g., Product Review Template"
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  placeholder="Describe your template..."
                  rows={2}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  >
                    {categories.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                  <Input
                    value={newTemplate.tags}
                    onChange={(e) => setNewTemplate({ ...newTemplate, tags: e.target.value })}
                    placeholder="e.g., review, product, guide"
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Template Content *</label>
                <Textarea
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                  placeholder="Enter your template content/prompt..."
                  rows={8}
                  className="bg-slate-800 border-slate-700 font-mono text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newTemplate.isPublic}
                  onChange={(e) => setNewTemplate({ ...newTemplate, isPublic: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isPublic" className="text-sm">Make this template public</label>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateTemplate}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500"
                >
                  Create Template
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {filteredTemplates.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover-lift flex flex-col">
              <CardHeader className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  {template.isPremium && (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                      Premium
                    </span>
                  )}
                </div>
                <CardDescription className="line-clamp-2">
                  {template.description || 'No description'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {template.downloads || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {template.rating?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                  <span className="capitalize">{template.category}</span>
                </div>
                {template.tags && template.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.tags.slice(0, 3).map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-slate-700 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => showToast('Template usage coming soon!', 'info')}
                >
                  Use Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Layers className="w-12 h-12 mx-auto mb-4 opacity-50 text-slate-400" />
            <p className="text-slate-400 mb-4">
              {viewMode === 'mine'
                ? 'You have no templates yet. Create your first template!'
                : 'No templates found for this filter. Be the first to share one!'}
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

