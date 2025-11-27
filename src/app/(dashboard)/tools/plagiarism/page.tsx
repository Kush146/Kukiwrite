'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/components/ui/Toast'
import { Shield, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react'

export default function PlagiarismCheckerPage() {
  const [content, setContent] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const { showToast } = useToast()

  const handleCheck = async () => {
    if (!content.trim()) {
      showToast('Please enter content to check', 'error')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/tools/plagiarism', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check plagiarism')
      }

      setResult(data)
      showToast('Plagiarism check completed!', 'success')
    } catch (error: any) {
      showToast(error.message || 'Failed to check plagiarism', 'error')
    } finally {
      setLoading(false)
    }
  }

  const getSimilarityColor = (similarity: number) => {
    if (similarity < 20) return 'text-green-400'
    if (similarity < 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getSimilarityBg = (similarity: number) => {
    if (similarity < 20) return 'bg-green-500/20 border-green-500/50'
    if (similarity < 50) return 'bg-yellow-500/20 border-yellow-500/50'
    return 'bg-red-500/20 border-red-500/50'
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Plagiarism Checker
        </h1>
        <p className="text-slate-300">
          Check your content for originality and potential plagiarism
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Content to Check
            </CardTitle>
            <CardDescription>Paste your content below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your content here to check for plagiarism..."
              rows={15}
              className="bg-slate-800 border-slate-700 font-mono text-sm"
            />
            <Button
              onClick={handleCheck}
              disabled={loading || !content.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                'Check for Plagiarism'
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>Plagiarism analysis results</CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-6">
                <div className={`p-6 rounded-lg border-2 ${getSimilarityBg(result.similarity)}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {result.isOriginal ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-6 h-6 text-yellow-400" />
                      )}
                      <span className="font-semibold text-lg">
                        {result.isOriginal ? 'Original Content' : 'Potential Issues Found'}
                      </span>
                    </div>
                    <div className={`text-3xl font-bold ${getSimilarityColor(result.similarity)}`}>
                      {result.similarity}%
                    </div>
                  </div>
                  <p className="text-sm text-slate-300">
                    Similarity Score: {result.similarity}% 
                    {result.similarity < 20 && ' - Excellent! Your content appears to be original.'}
                    {result.similarity >= 20 && result.similarity < 50 && ' - Some similarities detected. Review flagged sections.'}
                    {result.similarity >= 50 && ' - High similarity detected. Consider rewriting flagged sections.'}
                  </p>
                </div>

                {result.flaggedSections && result.flaggedSections.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 text-yellow-400">Flagged Sections</h3>
                    <div className="space-y-3">
                      {result.flaggedSections.map((section: any, idx: number) => (
                        <div key={idx} className="p-4 bg-slate-800 rounded-lg border border-yellow-500/30">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs text-yellow-400 font-semibold">
                              Similarity: {section.similarity}%
                            </span>
                          </div>
                          <p className="text-sm text-slate-300 mb-2 italic">
                            "{section.text}"
                          </p>
                          <p className="text-xs text-slate-400">
                            {section.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.isOriginal && (
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                    <p className="text-sm text-green-400">
                      ✓ Your content appears to be original. Great work!
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Results will appear here after checking</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

