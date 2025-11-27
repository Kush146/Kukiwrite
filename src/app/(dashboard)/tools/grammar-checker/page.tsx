'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { UsageBar } from '@/components/ui/UsageBar'
import { UpgradeBanner } from '@/components/ui/UpgradeBanner'
import { CopyButton } from '@/components/ui/CopyButton'
import { useToast } from '@/components/ui/Toast'
import { CheckCircle, XCircle, AlertCircle, Sparkles } from 'lucide-react'
import { useEffect } from 'react'

interface GrammarIssue {
  type: 'grammar' | 'spelling' | 'punctuation' | 'style'
  message: string
  suggestion: string
  position: { start: number; end: number }
  severity: 'error' | 'warning' | 'info'
}

export default function GrammarCheckerPage() {
  const [content, setContent] = useState('')
  const [checkedContent, setCheckedContent] = useState('')
  const [issues, setIssues] = useState<GrammarIssue[]>([])
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

  const handleCheck = async () => {
    if (!content.trim()) {
      showToast('Please enter content to check', 'error')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/tools/grammar-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })

      const data = await response.json()

      if (!response.ok) {
        showToast(data.error || 'Failed to check grammar', 'error')
        return
      }

      setCheckedContent(data.correctedContent)
      setIssues(data.issues || [])
      await fetchUsage()
      showToast('Grammar check complete!', 'success')
    } catch (error) {
      showToast('An error occurred', 'error')
    } finally {
      setLoading(false)
    }
  }

  const applySuggestion = (issue: GrammarIssue) => {
    const before = checkedContent.substring(0, issue.position.start)
    const after = checkedContent.substring(issue.position.end)
    const newContent = before + issue.suggestion + after
    setCheckedContent(newContent)
    setContent(newContent)
    setIssues(issues.filter(i => i !== issue))
    showToast('Suggestion applied', 'success')
  }

  const getSeverityIcon = (severity: GrammarIssue['severity']) => {
    switch (severity) {
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-orange-400" />
      default:
        return <CheckCircle className="w-4 h-4 text-blue-400" />
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Grammar Checker</h1>
        <p className="text-slate-300">Check and improve your content's grammar, spelling, and style</p>
      </div>

      {usage && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <UsageBar used={usage.used} limit={usage.limit} plan={usage.plan} />
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Paste your content to check</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your text here..."
              rows={15}
            />
            <Button onClick={handleCheck} disabled={loading} className="w-full mt-4">
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Check Grammar
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Corrected Content</CardTitle>
                <CardDescription>
                  {issues.length > 0 ? `${issues.length} issue${issues.length === 1 ? '' : 's'} found` : 'No issues found'}
                </CardDescription>
              </div>
              {checkedContent && <CopyButton text={checkedContent} variant="outline" size="sm" />}
            </div>
          </CardHeader>
          <CardContent>
            {checkedContent ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-slate-200">{checkedContent}</pre>
                </div>
                {issues.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Issues Found:</h4>
                    {issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-900/50 rounded-lg border border-slate-800"
                      >
                        <div className="flex items-start gap-2 mb-2">
                          {getSeverityIcon(issue.severity)}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-200">{issue.message}</p>
                            <p className="text-xs text-slate-400 mt-1">
                              Type: {issue.type} • {issue.severity}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-slate-300 flex-1">
                            <span className="text-slate-500">Suggestion:</span> {issue.suggestion}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => applySuggestion(issue)}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {issues.length === 0 && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                    <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-green-300 font-medium">No issues found! Your content looks great.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-slate-500 py-12">
                Corrected content will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



