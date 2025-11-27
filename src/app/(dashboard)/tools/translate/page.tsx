'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { CopyButton } from '@/components/ui/CopyButton'
import { ExportMenu } from '@/components/ui/ExportMenu'
import { useToast } from '@/components/ui/Toast'
import { Languages, Loader2 } from 'lucide-react'

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'tr', name: 'Turkish' },
  { code: 'sv', name: 'Swedish' },
  { code: 'da', name: 'Danish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'fi', name: 'Finnish' },
  { code: 'cs', name: 'Czech' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'ro', name: 'Romanian' },
  { code: 'el', name: 'Greek' },
  { code: 'th', name: 'Thai' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ms', name: 'Malay' },
  { code: 'he', name: 'Hebrew' },
  { code: 'uk', name: 'Ukrainian' }
]

export default function TranslatePage() {
  const [content, setContent] = useState('')
  const [sourceLanguage, setSourceLanguage] = useState('en')
  const [targetLanguage, setTargetLanguage] = useState('es')
  const [translation, setTranslation] = useState('')
  const [loading, setLoading] = useState(false)

  const { showToast } = useToast()

  const handleTranslate = async () => {
    if (!content.trim()) {
      showToast('Please enter content to translate', 'error')
      return
    }

    setLoading(true)
    setTranslation('')

    try {
      const response = await fetch('/api/tools/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          sourceLanguage,
          targetLanguage,
          options: {
            preserveTone: true,
            preserveFormatting: true
          }
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to translate')
      }

      setTranslation(data.translation)
      showToast('Translation completed!', 'success')
    } catch (error: any) {
      showToast(error.message || 'Failed to translate', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Translation Tool
        </h1>
        <p className="text-slate-300">
          Translate your content to 30+ languages while preserving tone and style
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Source Language</label>
          <select
            value={sourceLanguage}
            onChange={(e) => setSourceLanguage(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Target Language</label>
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="w-5 h-5" />
              Original Content
            </CardTitle>
            <CardDescription>Enter content to translate</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your content here..."
              rows={15}
              className="bg-slate-800 border-slate-700"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Translation</CardTitle>
            <CardDescription>Translated content</CardDescription>
          </CardHeader>
          <CardContent>
            {translation ? (
              <div className="space-y-4">
                <div className="flex gap-2 justify-end">
                  <CopyButton text={translation} />
                  <ExportMenu content={translation} filename="translation" />
                </div>
                <div className="prose prose-invert max-w-none bg-slate-900 p-4 rounded-lg border border-slate-700 min-h-[200px]">
                  <pre className="whitespace-pre-wrap text-sm text-slate-300 font-sans">
                    {translation}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Languages className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Translation will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Button
          onClick={handleTranslate}
          disabled={loading || !content.trim()}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Translating...
            </>
          ) : (
            <>
              <Languages className="w-4 h-4 mr-2" />
              Translate Content
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

