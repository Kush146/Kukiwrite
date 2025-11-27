'use client'

import { useEffect, useState } from 'react'
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

export default function InstagramToolPage() {
  const [campaign, setCampaign] = useState('')
  const [offer, setOffer] = useState('')
  const [tone, setTone] = useState('friendly')
  const [postType, setPostType] = useState('caption')
  const [hashtags, setHashtags] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [usage, setUsage] = useState<{ used: number; limit: number; plan: 'FREE' | 'PRO' } | null>(
    null
  )
  const [showUpgrade, setShowUpgrade] = useState(false)
  const { showToast } = useToast()
  const [lastInputs, setLastInputs] = useState<{ campaign: string; offer: string; tone: string; postType: string; hashtags: string } | null>(null)

  const fetchUsage = async () => {
    try {
      const response = await fetch('/api/user/usage')
      if (response.ok) {
        const data = await response.json()
        setUsage({ used: data.usage, limit: data.limit, plan: data.plan })
      }
    } catch (err) {
      console.error('Failed to fetch usage:', err)
    }
  }

  useEffect(() => {
    fetchUsage()
  }, [])

  const generateContent = async (inputs: { campaign: string; offer: string; tone: string; postType: string; hashtags: string }) => {
    setError('')
    setOutput('')
    setLoading(true)
    setShowUpgrade(false)

    try {
      const response = await fetch('/api/tools/instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === 'Usage limit exceeded') {
          setShowUpgrade(true)
        }
        setError(data.error || 'Failed to generate Instagram content')
        showToast(data.error || 'Failed to generate Instagram content', 'error')
        return
      }

      setOutput(data.output)
      setLastInputs(inputs)
      await fetchUsage()
      showToast('Instagram content generated successfully!', 'success')
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
    await generateContent({ campaign, offer, tone, postType, hashtags })
  }

  const handleRegenerate = () => {
    if (lastInputs) {
      generateContent(lastInputs)
    } else if (campaign && offer) {
      generateContent({ campaign, offer, tone, postType, hashtags })
    }
  }

  const handleDownload = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `instagram-content-${campaign.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'content'}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Download started', 'success')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Instagram Content Generator</h1>
        <p className="text-slate-300">
          Craft scroll-stopping captions, hashtag sets, and CTA ideas for your next post.
        </p>
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
            <CardDescription>Describe your Instagram post requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/60 text-red-200 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="campaign" className="block text-sm font-medium mb-1 text-slate-200">
                  Campaign Focus *
                </label>
                <Input
                  id="campaign"
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  required
                  placeholder="e.g. New summer drop, product launch..."
                />
              </div>
              <div>
                <label htmlFor="offer" className="block text-sm font-medium mb-1 text-slate-200">
                  Offer / Product Details *
                </label>
                <Textarea
                  id="offer"
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                  required
                  rows={4}
                  placeholder="Key benefits, audience, price point, differentiators..."
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
                  <option value="friendly">Friendly & Relatable</option>
                  <option value="playful">Playful & Bold</option>
                  <option value="luxury">Luxury & Aspirational</option>
                  <option value="professional">Professional & Informative</option>
                  <option value="storytelling">Storytelling</option>
                </select>
              </div>
              <div>
                <label htmlFor="postType" className="block text-sm font-medium mb-1 text-slate-200">
                  Post Type
                </label>
                <select
                  id="postType"
                  value={postType}
                  onChange={(e) => setPostType(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
                >
                  <option value="caption">Caption</option>
                  <option value="carousel">Carousel Concept</option>
                  <option value="reel">Reel Hook + Script</option>
                  <option value="story">Story Sequence</option>
                </select>
              </div>
              <div>
                <label htmlFor="hashtags" className="block text-sm font-medium mb-1 text-slate-200">
                  Must-have Hashtags
                </label>
                <Input
                  id="hashtags"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder="#brandhashtag, #summerdrop..."
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Generating...' : 'Generate Instagram Content'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Generated Content</CardTitle>
                <CardDescription>Ready-to-post copy and hashtag ideas</CardDescription>
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
                Generated Instagram content will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}




