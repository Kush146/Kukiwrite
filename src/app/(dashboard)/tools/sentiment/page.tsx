'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/components/ui/Toast'
import { Heart, Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function SentimentAnalysisPage() {
  const [content, setContent] = useState('')
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const { showToast } = useToast()

  const handleAnalyze = async () => {
    if (!content.trim()) {
      showToast('Please enter content to analyze', 'error')
      return
    }

    setLoading(true)
    setAnalysis(null)

    try {
      const response = await fetch('/api/tools/sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze sentiment')
      }

      setAnalysis(data)
      showToast('Analysis completed!', 'success')
    } catch (error: any) {
      showToast(error.message || 'Failed to analyze sentiment', 'error')
    } finally {
      setLoading(false)
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    if (sentiment === 'positive') return <TrendingUp className="w-5 h-5 text-green-400" />
    if (sentiment === 'negative') return <TrendingDown className="w-5 h-5 text-red-400" />
    return <Minus className="w-5 h-5 text-gray-400" />
  }

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === 'positive') return 'text-green-400'
    if (sentiment === 'negative') return 'text-red-400'
    return 'text-gray-400'
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Tone & Sentiment Analysis
        </h1>
        <p className="text-slate-300">
          Analyze the emotional tone and sentiment of your content
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Content to Analyze
            </CardTitle>
            <CardDescription>Enter your content below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your content here to analyze tone and sentiment..."
              rows={15}
              className="bg-slate-800 border-slate-700"
            />
            <Button
              onClick={handleAnalyze}
              disabled={loading || !content.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Content'
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>Tone and sentiment insights</CardDescription>
          </CardHeader>
          <CardContent>
            {analysis ? (
              <div className="space-y-6">
                {/* Tone Analysis */}
                <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    Tone Analysis
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Primary Tone</span>
                      <span className="font-semibold capitalize">{analysis.tone?.tone || 'N/A'}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${analysis.tone?.confidence || 0}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400">
                      Confidence: {analysis.tone?.confidence || 0}%
                    </p>
                    {analysis.tone?.alternativeTones && analysis.tone.alternativeTones.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        <p className="text-xs text-slate-400 mb-2">Alternative Tones:</p>
                        <div className="flex flex-wrap gap-2">
                          {analysis.tone.alternativeTones.map((alt: any, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-slate-700 rounded text-xs capitalize"
                            >
                              {alt.tone} ({alt.confidence}%)
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sentiment Analysis */}
                <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    {getSentimentIcon(analysis.sentiment?.sentiment || 'neutral')}
                    Sentiment Analysis
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Sentiment</span>
                      <span className={`font-semibold capitalize ${getSentimentColor(analysis.sentiment?.sentiment || 'neutral')}`}>
                        {analysis.sentiment?.sentiment || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Score:</span>
                      <div className="flex-1 bg-slate-700 rounded-full h-2 relative">
                        <div
                          className={`h-2 rounded-full ${
                            (analysis.sentiment?.score || 0) > 0 ? 'bg-green-500' :
                            (analysis.sentiment?.score || 0) < 0 ? 'bg-red-500' : 'bg-gray-500'
                          }`}
                          style={{
                            width: `${Math.abs((analysis.sentiment?.score || 0)) * 100}%`,
                            marginLeft: (analysis.sentiment?.score || 0) < 0 ? 'auto' : '0'
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold">
                        {(analysis.sentiment?.score || 0).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Confidence: {analysis.sentiment?.confidence || 0}%
                    </p>
                  </div>
                </div>

                {/* Emotional Markers */}
                {analysis.emotionalMarkers && analysis.emotionalMarkers.length > 0 && (
                  <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                    <h3 className="font-semibold mb-3">Emotional Markers</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.emotionalMarkers.map((marker: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs"
                        >
                          {marker}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {analysis.suggestions && analysis.suggestions.length > 0 && (
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <h3 className="font-semibold mb-3 text-blue-400">Suggestions</h3>
                    <ul className="space-y-2">
                      {analysis.suggestions.map((suggestion: string, idx: number) => (
                        <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-blue-400">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Analysis results will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

