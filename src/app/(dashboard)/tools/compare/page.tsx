'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/components/ui/Toast'
import { GitCompare, Copy } from 'lucide-react'
import { CopyButton } from '@/components/ui/CopyButton'

export default function ComparePage() {
  const [content1, setContent1] = useState('')
  const [content2, setContent2] = useState('')
  const { showToast } = useToast()

  const highlightDifferences = (text1: string, text2: string) => {
    const lines1 = text1.split('\n')
    const lines2 = text2.split('\n')
    const maxLines = Math.max(lines1.length, lines2.length)
    
    return Array.from({ length: maxLines }, (_, i) => {
      const line1 = lines1[i] || ''
      const line2 = lines2[i] || ''
      const isDifferent = line1 !== line2
      
      return {
        line1,
        line2,
        isDifferent
      }
    })
  }

  const differences = highlightDifferences(content1, content2)
  const diffCount = differences.filter(d => d.isDifferent).length

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Content Comparison</h1>
        <p className="text-slate-300">Compare two versions of content side-by-side</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Version 1</CardTitle>
            <CardDescription>Original or first version</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={content1}
              onChange={(e) => setContent1(e.target.value)}
              placeholder="Paste first version here..."
              rows={15}
              className="font-mono text-sm"
            />
            <div className="mt-2 flex justify-end">
              <CopyButton text={content1} variant="outline" size="sm" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Version 2</CardTitle>
            <CardDescription>Modified or second version</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={content2}
              onChange={(e) => setContent2(e.target.value)}
              placeholder="Paste second version here..."
              rows={15}
              className="font-mono text-sm"
            />
            <div className="mt-2 flex justify-end">
              <CopyButton text={content2} variant="outline" size="sm" />
            </div>
          </CardContent>
        </Card>
      </div>

      {content1 && content2 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <GitCompare className="w-5 h-5" />
                  Comparison
                </CardTitle>
                <CardDescription>
                  {diffCount} {diffCount === 1 ? 'difference' : 'differences'} found
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {differences.map((diff, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${
                    diff.isDifferent
                      ? 'bg-orange-500/10 border-orange-500/30'
                      : 'bg-slate-900/30 border-slate-800'
                  }`}
                >
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Version 1</div>
                      <pre className={`whitespace-pre-wrap ${diff.isDifferent ? 'text-orange-300' : 'text-slate-300'}`}>
                        {diff.line1 || '(empty)'}
                      </pre>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Version 2</div>
                      <pre className={`whitespace-pre-wrap ${diff.isDifferent ? 'text-orange-300' : 'text-slate-300'}`}>
                        {diff.line2 || '(empty)'}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}



