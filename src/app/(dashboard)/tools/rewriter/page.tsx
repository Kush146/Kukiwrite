'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { UsageBar } from '@/components/ui/UsageBar'
import { UpgradeBanner } from '@/components/ui/UpgradeBanner'
import { CopyButton } from '@/components/ui/CopyButton'
import { Skeleton, TextSkeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/Toast'
import { RefreshCw, Download } from 'lucide-react'

export default function RewriterToolPage() {
  const [content, setContent] = useState('')
  const [tone, setTone] = useState('maintain original tone')
  const [style, setStyle] = useState('professional')
  const [purpose, setPurpose] = useState('improve clarity and engagement')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [usage, setUsage] = useState<{ used: number; limit: number; plan: 'FREE' | 'PRO' } | null>(null)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const { showToast } = useToast()
  const [lastInputs, setLastInputs] = useState<{ content: string; tone: string; style: string; purpose: string } | null>(null)

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

  const generateContent = async (inputs: { content: string; tone: string; style: string; purpose: string }) => {
    setError('')
    setOutput('')
    setLoading(true)
    setShowUpgrade(false)

    try {
      const response = await fetch('/api/tools/rewriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === 'Usage limit exceeded') {
          setShowUpgrade(true)
        }
        setError(data.error || 'Failed to rewrite content')
        showToast(data.error || 'Failed to rewrite content', 'error')
        return
      }

      setOutput(data.output)
      setLastInputs(inputs)
      await fetchUsage()
      showToast('Content rewritten successfully!', 'success')
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
    await generateContent({ content, tone, style, purpose })
  }

  const handleRegenerate = () => {
    if (lastInputs) {
      generateContent(lastInputs)
    } else if (content) {
      generateContent({ content, tone, style, purpose })
    }
  }

  const handleDownload = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rewritten-content-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Download started', 'success')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Content Rewriter</h1>
        <p className="text-slate-300">Rewrite and improve existing content with different tones and styles.</p>
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
            <CardDescription>Enter content to rewrite</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/60 text-red-200 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="content" className="block text-sm font-medium mb-1 text-slate-200">
                  Content to Rewrite *
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  placeholder="Paste the content you want to rewrite here..."
                  rows={10}
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
                  <option value="maintain original tone">Maintain Original Tone</option>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                  <option value="formal">Formal</option>
                  <option value="conversational">Conversational</option>
                </select>
              </div>
              <div>
                <label htmlFor="style" className="block text-sm font-medium mb-1 text-slate-200">
                  Style
                </label>
                <select
                  id="style"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
                >
                  <option value="professional">Professional</option>
                  <option value="creative">Creative</option>
                  <option value="simple">Simple</option>
                  <option value="detailed">Detailed</option>
                </select>
              </div>
              <div>
                <label htmlFor="purpose" className="block text-sm font-medium mb-1 text-slate-200">
                  Purpose
                </label>
                <select
                  id="purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
                >
                  <option value="improve clarity and engagement">Improve Clarity & Engagement</option>
                  <option value="make it more concise">Make it More Concise</option>
                  <option value="expand and add detail">Expand & Add Detail</option>
                  <option value="change perspective">Change Perspective</option>
                </select>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Rewriting...' : 'Rewrite Content'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Rewritten Content</CardTitle>
                <CardDescription>Your AI-rewritten content</CardDescription>
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
                Rewritten content will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

