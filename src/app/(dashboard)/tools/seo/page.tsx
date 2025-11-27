'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { UsageBar } from '@/components/ui/UsageBar'
import { UpgradeBanner } from '@/components/ui/UpgradeBanner'
import { CopyButton } from '@/components/ui/CopyButton'
import { Skeleton, TextSkeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/Toast'
import { RefreshCw, Download } from 'lucide-react'

export default function SEOToolPage() {
  const [keyword, setKeyword] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [contentType, setContentType] = useState('blog post')
  const [competitors, setCompetitors] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [usage, setUsage] = useState<{ used: number; limit: number; plan: 'FREE' | 'PRO' } | null>(null)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const { showToast } = useToast()
  const [lastInputs, setLastInputs] = useState<{ keyword: string; targetAudience: string; contentType: string; competitors: string } | null>(null)

  useEffect(() => {
    fetchUsage()
  }, [])

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

  const generateContent = async (inputs: { keyword: string; targetAudience: string; contentType: string; competitors: string }) => {
    setError('')
    setOutput('')
    setLoading(true)
    setShowUpgrade(false)

    try {
      const response = await fetch('/api/tools/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === 'Usage limit exceeded') {
          setShowUpgrade(true)
        }
        setError(data.error || 'Failed to generate SEO content')
        showToast(data.error || 'Failed to generate SEO content', 'error')
        return
      }

      setOutput(data.output)
      setLastInputs(inputs)
      await fetchUsage()
      showToast('SEO content generated successfully!', 'success')
    } catch (err) {
      const errorMsg = 'An error occurred. Please try again.'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await generateContent({ keyword, targetAudience, contentType, competitors })
  }

  const handleRegenerate = () => {
    if (lastInputs) {
      generateContent(lastInputs)
    } else if (keyword) {
      generateContent({ keyword, targetAudience, contentType, competitors })
    }
  }

  const handleDownload = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `seo-content-${keyword.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'content'}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Download started', 'success')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">SEO Content Generator</h1>
        <p className="text-slate-300">Optimize your content for search engines with keyword strategies.</p>
      </div>

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
            <CardDescription>Enter your SEO requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/60 text-red-200 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="keyword" className="block text-sm font-medium mb-1 text-slate-200">
                  Primary Keyword *
                </label>
                <Input
                  id="keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  required
                  placeholder="best productivity tips"
                />
              </div>
              <div>
                <label htmlFor="targetAudience" className="block text-sm font-medium mb-1 text-slate-200">
                  Target Audience
                </label>
                <Input
                  id="targetAudience"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="professionals, entrepreneurs, students"
                />
              </div>
              <div>
                <label htmlFor="contentType" className="block text-sm font-medium mb-1 text-slate-200">
                  Content Type
                </label>
                <select
                  id="contentType"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
                >
                  <option value="blog post">Blog Post</option>
                  <option value="article">Article</option>
                  <option value="landing page">Landing Page</option>
                  <option value="product description">Product Description</option>
                </select>
              </div>
              <div>
                <label htmlFor="competitors" className="block text-sm font-medium mb-1 text-slate-200">
                  Competitors (optional)
                </label>
                <Textarea
                  id="competitors"
                  value={competitors}
                  onChange={(e) => setCompetitors(e.target.value)}
                  placeholder="List competitor URLs or keywords..."
                  rows={3}
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Generating...' : 'Generate SEO Strategy'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>SEO Strategy</CardTitle>
                <CardDescription>Your AI-generated SEO content strategy</CardDescription>
              </div>
              {output && (
                <div className="flex gap-2">
                  <CopyButton text={output} variant="outline" size="sm" />
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Regenerate
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <TextSkeleton lines={10} />
            ) : output ? (
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm">{output}</pre>
              </div>
            ) : (
              <div className="text-center text-slate-500 py-12">
                Generated SEO strategy will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

