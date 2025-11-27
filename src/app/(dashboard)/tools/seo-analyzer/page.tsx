'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/components/ui/Toast'
import { Search, CheckCircle, XCircle, AlertCircle, TrendingUp } from 'lucide-react'

interface SEOAnalysis {
  wordCount: number
  keywordDensity: number
  readabilityScore: number
  hasHeadings: boolean
  hasMetaDescription: boolean
  issues: string[]
  suggestions: string[]
}

export default function SEOAnalyzerPage() {
  const [content, setContent] = useState('')
  const [keyword, setKeyword] = useState('')
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null)
  const { showToast } = useToast()

  const analyzeContent = () => {
    if (!content.trim()) {
      showToast('Please enter content to analyze', 'error')
      return
    }

    const words = content.split(/\s+/).filter(w => w.length > 0)
    const wordCount = words.length
    const keywordLower = keyword.toLowerCase()
    const keywordMatches = content.toLowerCase().split(keywordLower).length - 1
    const keywordDensity = keyword ? (keywordMatches / wordCount) * 100 : 0

    // Simple readability (average words per sentence)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const avgWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : 0
    const readabilityScore = Math.min(100, Math.max(0, 100 - (avgWordsPerSentence - 15) * 2))

    const hasHeadings = /^#+\s/.test(content) || /<h[1-6]>/i.test(content)
    const hasMetaDescription = content.length >= 120 && content.length <= 160

    const issues: string[] = []
    const suggestions: string[] = []

    if (wordCount < 300) {
      issues.push('Content is too short (less than 300 words)')
      suggestions.push('Aim for at least 300-500 words for better SEO')
    }

    if (keyword && keywordDensity < 1) {
      issues.push('Keyword density is too low')
      suggestions.push(`Increase keyword usage. Current density: ${keywordDensity.toFixed(2)}%`)
    }

    if (keyword && keywordDensity > 3) {
      issues.push('Keyword density is too high (keyword stuffing)')
      suggestions.push('Reduce keyword usage to avoid over-optimization')
    }

    if (!hasHeadings) {
      issues.push('No headings found')
      suggestions.push('Add H1-H6 headings to structure your content')
    }

    if (readabilityScore < 60) {
      issues.push('Readability could be improved')
      suggestions.push('Use shorter sentences and simpler words')
    }

    if (wordCount > 0 && wordCount < 100) {
      suggestions.push('Consider expanding content for better SEO value')
    }

    setAnalysis({
      wordCount,
      keywordDensity: keywordDensity || 0,
      readabilityScore: Math.round(readabilityScore),
      hasHeadings,
      hasMetaDescription,
      issues,
      suggestions
    })

    showToast('Analysis complete!', 'success')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">SEO Analyzer</h1>
        <p className="text-slate-300">Analyze your content for SEO optimization</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Input</CardTitle>
            <CardDescription>Paste your content to analyze</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Target Keyword (optional)</label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g., productivity tips"
                className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your content here..."
                rows={15}
              />
            </div>
            <Button onClick={analyzeContent} className="w-full">
              <Search className="w-4 h-4 mr-2" />
              Analyze Content
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO Analysis</CardTitle>
            <CardDescription>Your content SEO score and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            {analysis ? (
              <div className="space-y-6">
                {/* Score Overview */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">{analysis.wordCount}</div>
                    <div className="text-xs text-slate-400 mt-1">Word Count</div>
                  </div>
                  <div className="p-4 bg-slate-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">{analysis.readabilityScore}</div>
                    <div className="text-xs text-slate-400 mt-1">Readability Score</div>
                  </div>
                </div>

                {keyword && (
                  <div className="p-4 bg-slate-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{analysis.keywordDensity.toFixed(2)}%</div>
                    <div className="text-xs text-slate-400 mt-1">Keyword Density</div>
                    <div className="text-xs text-slate-500 mt-2">
                      Optimal: 1-3%
                    </div>
                  </div>
                )}

                {/* Checks */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {analysis.hasHeadings ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className="text-sm">Headings present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {analysis.wordCount >= 300 ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className="text-sm">Minimum word count (300+)</span>
                  </div>
                </div>

                {/* Issues */}
                {analysis.issues.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-400" />
                      Issues Found
                    </h4>
                    <ul className="space-y-1">
                      {analysis.issues.map((issue, idx) => (
                        <li key={idx} className="text-sm text-orange-300 flex items-start gap-2">
                          <span className="text-orange-400">•</span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                {analysis.suggestions.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                      Suggestions
                    </h4>
                    <ul className="space-y-1">
                      {analysis.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-blue-400">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.issues.length === 0 && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                    <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-green-300 font-medium">Great! No major issues found.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-slate-500 py-12">
                Enter content and click "Analyze Content" to see results
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



