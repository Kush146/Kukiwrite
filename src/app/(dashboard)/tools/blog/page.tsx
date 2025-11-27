'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { UsageBar } from '@/components/ui/UsageBar'
import { UpgradeBanner } from '@/components/ui/UpgradeBanner'
import { CopyButton } from '@/components/ui/CopyButton'
import { RetryButton } from '@/components/ui/RetryButton'
import { Skeleton, TextSkeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/Toast'
import { TemplateSelector } from '@/components/ui/TemplateSelector'
import { ContentEditor } from '@/components/ui/ContentEditor'
import { ExportMenu } from '@/components/ui/ExportMenu'
import { RefreshCw, Download, Sparkles, Star, Layers } from 'lucide-react'

export default function BlogToolPage() {
  const [title, setTitle] = useState('')
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('professional')
  const [length, setLength] = useState('medium')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastError, setLastError] = useState('')
  const [lastInputs, setLastInputs] = useState<{ title: string; topic: string; tone: string; length: string } | null>(null)
  const [usage, setUsage] = useState<{ used: number; limit: number; plan: 'FREE' | 'PRO' } | null>(null)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [variations, setVariations] = useState<string[]>([])
  const [showVariations, setShowVariations] = useState(false)
  const { showToast } = useToast()
  const [showTemplates, setShowTemplates] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const templates = [
    {
      id: 'product-review',
      name: 'Product Review',
      description: 'Template for reviewing products',
      data: {
        title: 'Product Review: [Product Name]',
        topic: 'Comprehensive review covering features, pros, cons, and recommendations',
        tone: 'professional',
        length: 'medium'
      }
    },
    {
      id: 'how-to-guide',
      name: 'How-To Guide',
      description: 'Step-by-step tutorial template',
      data: {
        title: 'How to [Topic]: Complete Guide',
        topic: 'Detailed step-by-step guide with tips and best practices',
        tone: 'friendly',
        length: 'long'
      }
    },
    {
      id: 'list-article',
      name: 'List Article',
      description: 'Top 10 or list-style article',
      data: {
        title: 'Top 10 [Topic] You Need to Know',
        topic: 'List format with explanations for each item',
        tone: 'engaging',
        length: 'medium'
      }
    }
  ]

  const handleTemplateSelect = (template: any) => {
    setTitle(template.data.title)
    setTopic(template.data.topic)
    setTone(template.data.tone)
    setLength(template.data.length)
    showToast(`Template "${template.name}" loaded!`, 'success')
  }

  const fetchUsage = async () => {
    try {
      const response = await fetch('/api/user/usage')
      if (response.ok) {
        const data = await response.json()
        setUsage({ used: data.usage, limit: data.limit, plan: data.plan })
      }
    } catch (error) {
      console.error('Failed to fetch usage:', error)
    }
  }

  useEffect(() => {
    fetchUsage()
  }, [])

  const generateContent = async (inputs: { title: string; topic: string; tone: string; length: string }) => {
    setError('')
    setOutput('')
    setLoading(true)
    setShowUpgrade(false)

    try {
      const response = await fetch('/api/tools/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === 'Usage limit exceeded') {
          setShowUpgrade(true)
        }
        setError(data.error || 'Failed to generate blog post')
        showToast(data.error || 'Failed to generate blog post', 'error')
        return
      }

      setOutput(data.output)
      setLastInputs(inputs)
      setVariations([])
      setShowVariations(false)
      await fetchUsage()
      showToast('Blog post generated successfully!', 'success')
    } catch (err: any) {
      const errorMsg = err.message || 'An error occurred. Please try again.'
      setLastError(errorMsg)
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = async () => {
    if (lastInputs) {
      await generateContent(lastInputs)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await generateContent({ title, topic, tone, length })
  }

  const handleRegenerate = () => {
    if (lastInputs) {
      generateContent(lastInputs)
    } else if (title && topic) {
      generateContent({ title, topic, tone, length })
    }
  }

  const handleGenerateVariations = async () => {
    if (!lastInputs) return
    setShowVariations(true)
    setVariations([])
    
    try {
      const variationPromises = Array.from({ length: 3 }, () =>
        fetch('/api/tools/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...lastInputs, variation: true })
        }).then(res => res.json())
      )
      
      const results = await Promise.all(variationPromises)
      setVariations(results.map(r => r.output).filter(Boolean))
      showToast('Variations generated!', 'success')
    } catch (error) {
      showToast('Failed to generate variations', 'error')
    }
  }

  const handleSaveContent = async (editedContent: string) => {
    // Save edited content
    setOutput(editedContent)
    showToast('Content saved!', 'success')
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Blog Post Generator</h1>
          <p className="text-slate-300">Generate comprehensive blog posts on any topic.</p>
        </div>
        <Button variant="outline" onClick={() => setShowTemplates(true)}>
          <Sparkles className="w-4 h-4 mr-2" />
          Templates
        </Button>
      </div>

      {showTemplates && (
        <TemplateSelector
          templates={templates}
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {usage && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <UsageBar used={usage.used} limit={usage.limit} plan={usage.plan} />
          </CardContent>
        </Card>
      )}

      {showUpgrade && <UpgradeBanner />}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Enter your blog post requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <RetryButton
                  onRetry={handleRetry}
                  error={error}
                />
              )}
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1 text-slate-200">
                  Title *
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="10 Tips for Better Productivity"
                />
              </div>
              <div>
                <label htmlFor="topic" className="block text-sm font-medium mb-1 text-slate-200">
                  Topic *
                </label>
                <Textarea
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                  placeholder="Describe the main topic and key points..."
                  rows={4}
                />
              </div>
              <div>
                <label htmlFor="tone" className="block text-sm font-medium mb-1 text-slate-200">
                  Tone
                </label>
                <select
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                  <option value="formal">Formal</option>
                  <option value="conversational">Conversational</option>
                </select>
              </div>
              <div>
                <label htmlFor="length" className="block text-sm font-medium mb-1 text-slate-200">
                  Length
                </label>
                <select
                  id="length"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
                >
                  <option value="short">Short (500-800 words)</option>
                  <option value="medium">Medium (1000-1500 words)</option>
                  <option value="long">Long (2000+ words)</option>
                </select>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Generating...' : 'Generate Blog Post'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Generated Content</CardTitle>
                <CardDescription>Your AI-generated blog post</CardDescription>
              </div>
              {output && (
                <div className="flex gap-2 flex-wrap">
                  <CopyButton text={output} variant="outline" size="sm" />
                  <ExportMenu content={output} filename={`blog-post-${title.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'content'}`} />
                  <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Regenerate
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleGenerateVariations}>
                    <Layers className="w-4 h-4 mr-2" />
                    Variations
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsFavorite(!isFavorite)
                      showToast(isFavorite ? 'Removed from favorites' : 'Added to favorites', 'success')
                    }}
                  >
                    <Star className={`w-4 h-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <TextSkeleton lines={10} />
            ) : output ? (
              <div className="space-y-4">
                <ContentEditor
                  content={output}
                  onSave={handleSaveContent}
                  editable={true}
                />
                {showVariations && variations.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-800">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      Variations
                    </h4>
                    <div className="space-y-4">
                      {variations.map((variation, idx) => (
                        <div key={idx} className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-slate-400">Variation {idx + 1}</span>
                            <div className="flex gap-2">
                              <CopyButton text={variation} variant="ghost" size="sm" />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setOutput(variation)
                                  showToast('Variation selected', 'success')
                                }}
                              >
                                Use This
                              </Button>
                            </div>
                          </div>
                          <pre className="text-xs text-slate-300 whitespace-pre-wrap max-h-40 overflow-y-auto">
                            {variation.substring(0, 500)}...
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-slate-500 py-12">
                Generated content will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

