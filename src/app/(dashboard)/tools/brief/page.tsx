'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { CopyButton } from '@/components/ui/CopyButton'
import { ExportMenu } from '@/components/ui/ExportMenu'
import { useToast } from '@/components/ui/Toast'
import { FileText, Loader2 } from 'lucide-react'

export default function BriefGeneratorPage() {
  const [topic, setTopic] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [goals, setGoals] = useState('')
  const [format, setFormat] = useState('blog post')
  const [tone, setTone] = useState('professional')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const { showToast } = useToast()

  const handleGenerate = async () => {
    if (!topic.trim()) {
      showToast('Please enter a topic', 'error')
      return
    }

    setLoading(true)
    setOutput('')

    try {
      const response = await fetch('/api/tools/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          targetAudience,
          goals,
          format,
          tone
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate brief')
      }

      setOutput(data.output)
      showToast('Content brief generated successfully!', 'success')
    } catch (error: any) {
      showToast(error.message || 'Failed to generate brief', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Content Brief Generator
        </h1>
        <p className="text-slate-300">
          Create comprehensive content briefs with research, structure, and strategy
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Brief Details
            </CardTitle>
            <CardDescription>Enter the details for your content brief</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Topic *</label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., AI in Healthcare"
                className="bg-slate-800 border-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Target Audience</label>
              <Input
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g., Healthcare professionals, tech enthusiasts"
                className="bg-slate-800 border-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content Goals</label>
              <Textarea
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="e.g., Educate, drive conversions, build authority"
                rows={3}
                className="bg-slate-800 border-slate-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="blog post">Blog Post</option>
                  <option value="article">Article</option>
                  <option value="whitepaper">Whitepaper</option>
                  <option value="case study">Case Study</option>
                  <option value="social media">Social Media</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                  <option value="formal">Formal</option>
                  <option value="humorous">Humorous</option>
                </select>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Brief...
                </>
              ) : (
                'Generate Content Brief'
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Brief</CardTitle>
            <CardDescription>Your comprehensive content brief</CardDescription>
          </CardHeader>
          <CardContent>
            {output ? (
              <div className="space-y-4">
                <div className="flex gap-2 justify-end">
                  <CopyButton text={output} />
                  <ExportMenu content={output} filename="content-brief" />
                </div>
                <div className="prose prose-invert max-w-none bg-slate-900 p-4 rounded-lg border border-slate-700">
                  <pre className="whitespace-pre-wrap text-sm text-slate-300 font-sans">
                    {output}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Your content brief will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

