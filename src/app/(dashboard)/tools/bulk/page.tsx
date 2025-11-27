'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Input } from '@/components/ui/Input'
import { UsageBar } from '@/components/ui/UsageBar'
import { UpgradeBanner } from '@/components/ui/UpgradeBanner'
import { CopyButton } from '@/components/ui/CopyButton'
import { ExportMenu } from '@/components/ui/ExportMenu'
import { useToast } from '@/components/ui/Toast'
import { Upload, Download, FileText, Loader2 } from 'lucide-react'

export default function BulkGenerationPage() {
  const [toolType, setToolType] = useState('BLOG')
  const [inputs, setInputs] = useState('')
  const [results, setResults] = useState<Array<{ input: string; output: string; status: 'pending' | 'success' | 'error' }>>([])
  const [loading, setLoading] = useState(false)
  const [usage, setUsage] = useState<{ used: number; limit: number; plan: 'FREE' | 'PRO' } | null>(null)
  const { showToast } = useToast()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        setInputs(text)
      }
      reader.readAsText(file)
    }
  }

  const handleBulkGenerate = async () => {
    const inputLines = inputs.split('\n').filter(line => line.trim())
    if (inputLines.length === 0) {
      showToast('Please enter at least one input', 'error')
      return
    }

    setLoading(true)
    setResults(inputLines.map(input => ({ input: input.trim(), output: '', status: 'pending' as const })))

    try {
      const promises = inputLines.map(async (input, index) => {
        try {
          const response = await fetch(`/api/tools/${toolType.toLowerCase()}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: input, title: input })
          })

          const data = await response.json()
          if (response.ok) {
            setResults(prev => {
              const newResults = [...prev]
              newResults[index] = { input, output: data.output, status: 'success' }
              return newResults
            })
            return { input, output: data.output, status: 'success' as const }
          } else {
            throw new Error(data.error || 'Failed')
          }
        } catch (error) {
          setResults(prev => {
            const newResults = [...prev]
            newResults[index] = { input, output: '', status: 'error' }
            return newResults
          })
          return { input, output: '', status: 'error' as const }
        }
      })

      await Promise.all(promises)
      showToast(`Generated ${results.filter(r => r.status === 'success').length} items`, 'success')
    } catch (error) {
      showToast('Bulk generation failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const exportAll = () => {
    const allContent = results
      .filter(r => r.status === 'success')
      .map((r, idx) => `=== Item ${idx + 1} ===\n${r.input}\n\n${r.output}\n\n`)
      .join('\n')
    
    const blob = new Blob([allContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bulk-generation-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    showToast('All results exported', 'success')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bulk Generation</h1>
        <p className="text-slate-300">Generate multiple pieces of content at once</p>
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
            <CardDescription>Enter topics, one per line, or upload a file</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tool Type</label>
              <select
                value={toolType}
                onChange={(e) => setToolType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
              >
                <option value="BLOG">Blog Post</option>
                <option value="YOUTUBE">YouTube Script</option>
                <option value="SEO">SEO Content</option>
                <option value="INSTAGRAM">Instagram Content</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Inputs (one per line)</label>
              <Textarea
                value={inputs}
                onChange={(e) => setInputs(e.target.value)}
                placeholder="Topic 1&#10;Topic 2&#10;Topic 3"
                rows={10}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Or upload a file</label>
              <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-slate-600 transition-colors">
                <Upload className="w-5 h-5 mr-2" />
                <span className="text-sm">Click to upload or drag and drop</span>
                <input type="file" className="hidden" accept=".txt,.csv" onChange={handleFileUpload} />
              </label>
            </div>
            <Button onClick={handleBulkGenerate} disabled={loading || !inputs.trim()} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate All
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Results</CardTitle>
                <CardDescription>{results.filter(r => r.status === 'success').length} generated</CardDescription>
              </div>
              {results.length > 0 && (
                <Button variant="outline" size="sm" onClick={exportAll}>
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {results.length === 0 ? (
                <div className="text-center text-slate-500 py-12">
                  Results will appear here
                </div>
              ) : (
                results.map((result, idx) => (
                  <div key={idx} className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-400">Item {idx + 1}</span>
                      {result.status === 'success' && (
                        <div className="flex gap-2">
                          <CopyButton text={result.output} variant="ghost" size="sm" />
                          <ExportMenu content={result.output} filename={`bulk-item-${idx + 1}`} />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{result.input}</p>
                    {result.status === 'pending' && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Generating...</span>
                      </div>
                    )}
                    {result.status === 'error' && (
                      <p className="text-sm text-red-400">Failed to generate</p>
                    )}
                    {result.status === 'success' && (
                      <pre className="text-xs text-slate-300 whitespace-pre-wrap max-h-40 overflow-y-auto">
                        {result.output.substring(0, 300)}...
                      </pre>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



