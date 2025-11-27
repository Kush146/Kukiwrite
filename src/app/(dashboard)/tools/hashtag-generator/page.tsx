'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Input } from '@/components/ui/Input'
import { UsageBar } from '@/components/ui/UsageBar'
import { UpgradeBanner } from '@/components/ui/UpgradeBanner'
import { CopyButton } from '@/components/ui/CopyButton'
import { useToast } from '@/components/ui/Toast'
import { Hash, Sparkles } from 'lucide-react'

export default function HashtagGeneratorPage() {
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [hashtags, setHashtags] = useState('')
  const [loading, setLoading] = useState(false)
  const [usage, setUsage] = useState<{ used: number; limit: number; plan: 'FREE' | 'PRO' } | null>(null)
  const { showToast } = useToast()

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

  const handleGenerate = async () => {
    if (!topic.trim()) {
      showToast('Please enter a topic', 'error')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/tools/hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform })
      })

      const data = await response.json()

      if (!response.ok) {
        showToast(data.error || 'Failed to generate hashtags', 'error')
        return
      }

      setHashtags(data.hashtags)
      await fetchUsage()
      showToast('Hashtags generated!', 'success')
    } catch (error) {
      showToast('An error occurred', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Hashtag Generator</h1>
        <p className="text-slate-300">Generate relevant hashtags for your content</p>
      </div>

      {usage && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <UsageBar used={usage.used} limit={usage.limit} plan={usage.plan} />
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Describe your content topic</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
              >
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter/X</option>
                <option value="tiktok">TikTok</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Topic/Content</label>
              <Textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Productivity tips for remote workers, Summer fashion trends..."
                rows={6}
              />
            </div>
            <Button onClick={handleGenerate} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Hash className="w-4 h-4 mr-2" />
                  Generate Hashtags
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Generated Hashtags</CardTitle>
                <CardDescription>Copy and use these hashtags</CardDescription>
              </div>
              {hashtags && <CopyButton text={hashtags} variant="outline" size="sm" />}
            </div>
          </CardHeader>
          <CardContent>
            {hashtags ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-slate-200">{hashtags}</pre>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hashtags.split(/\s+/).filter(h => h.startsWith('#')).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm hover:bg-blue-500/30 transition-colors cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(tag)
                        showToast('Hashtag copied!', 'success')
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 py-12">
                Generated hashtags will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

