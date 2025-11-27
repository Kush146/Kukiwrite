'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card'
import { Button } from './Button'
import { Sparkles, X } from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  data: Record<string, any>
}

interface TemplateSelectorProps {
  templates: Template[]
  onSelect: (template: Template) => void
  onClose?: () => void
}

export function TemplateSelector({ templates, onSelect, onClose }: TemplateSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = (template: Template) => {
    setSelected(template.id)
    onSelect(template)
    if (onClose) onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <CardTitle>Templates</CardTitle>
            </div>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          <CardDescription>Choose a template to quickly get started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelect(template)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  selected === template.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                }`}
              >
                <h3 className="font-semibold mb-1">{template.name}</h3>
                <p className="text-sm text-slate-400">{template.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

