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

export default function YouTubeToolPage() {
  const [topic, setTopic] = useState('')
  const [duration, setDuration] = useState('10 minutes')
  const [style, setStyle] = useState('engaging and conversational')
  const [includeIntro, setIncludeIntro] = useState(true)
  const [includeOutro, setIncludeOutro] = useState(true)
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [usage, setUsage] = useState<{ used: number; limit: number; plan: 'FREE' | 'PRO' } | null>(null)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const { showToast } = useToast()
  const [lastInputs, setLastInputs] = useState<{ topic: string; duration: string; style: string; includeIntro: boolean; includeOutro: boolean } | null>(null)

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

  const generateContent = async (inputs: { topic: string; duration: string; style: string; includeIntro: boolean; includeOutro: boolean }) => {
    setError('')
    setOutput('')
    setLoading(true)
    setShowUpgrade(false)

    try {
      const response = await fetch('/api/tools/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === 'Usage limit exceeded') {
          setShowUpgrade(true)
        }
        setError(data.error || 'Failed to generate YouTube script')
        showToast(data.error || 'Failed to generate YouTube script', 'error')
        return
      }

      setOutput(data.output)
      setLastInputs(inputs)
      await fetchUsage()
      showToast('YouTube script generated successfully!', 'success')
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
    await generateContent({ topic, duration, style, includeIntro, includeOutro })
  }

  const handleRegenerate = () => {
    if (lastInputs) {
      generateContent(lastInputs)
    } else if (topic) {
      generateContent({ topic, duration, style, includeIntro, includeOutro })
    }
  }

  const handleDownload = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `youtube-script-${topic.substring(0, 30).replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'content'}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Download started', 'success')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">YouTube Script Generator</h1>
        <p className="text-slate-300">Create engaging video scripts with hooks, transitions, and CTAs.</p>
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
            <CardDescription>Enter your video requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/60 text-red-200 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="topic" className="block text-sm font-medium mb-1 text-slate-200">
                  Video Topic *
                </label>
                <Textarea
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                  placeholder="Describe your video topic and key points..."
                  rows={4}
                />
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium mb-1 text-slate-200">
                  Duration
                </label>
                <select
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
                >
                  <option value="5 minutes">5 minutes</option>
                  <option value="10 minutes">10 minutes</option>
                  <option value="15 minutes">15 minutes</option>
                  <option value="20 minutes">20 minutes</option>
                  <option value="30+ minutes">30+ minutes</option>
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
                  <option value="engaging and conversational">Engaging & Conversational</option>
                  <option value="educational and informative">Educational & Informative</option>
                  <option value="entertaining and humorous">Entertaining & Humorous</option>
                  <option value="professional and formal">Professional & Formal</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-slate-200">
                  <input
                    type="checkbox"
                    checked={includeIntro}
                    onChange={(e) => setIncludeIntro(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900"
                  />
                  <span className="text-sm">Include Introduction/Hook</span>
                </label>
                <label className="flex items-center space-x-2 text-slate-200">
                  <input
                    type="checkbox"
                    checked={includeOutro}
                    onChange={(e) => setIncludeOutro(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900"
                  />
                  <span className="text-sm">Include Outro/Call-to-Action</span>
                </label>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Generating...' : 'Generate Script'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Generated Script</CardTitle>
                <CardDescription>Your AI-generated YouTube script</CardDescription>
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
                Generated script will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

