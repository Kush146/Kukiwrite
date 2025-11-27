'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Sparkles } from 'lucide-react'

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (model: string) => void
  className?: string
}

export function ModelSelector({ selectedModel, onModelChange, className = '' }: ModelSelectorProps) {
  const [availableModels, setAvailableModels] = useState<string[]>(['gpt-4o-mini'])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/ai/models')
      .then(res => res.json())
      .then(data => {
        if (data.models && data.models.length > 0) {
          setAvailableModels(data.models)
          if (!selectedModel || !data.models.includes(selectedModel)) {
            onModelChange(data.models[0])
          }
        }
      })
      .catch(err => {
        console.error('Failed to fetch models:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const getModelLabel = (model: string) => {
    const labels: Record<string, string> = {
      'gpt-4o': 'GPT-4o',
      'gpt-4o-mini': 'GPT-4o Mini',
      'claude-3-5-sonnet': 'Claude 3.5 Sonnet',
      'claude-3-opus': 'Claude 3 Opus',
      'gemini-pro': 'Gemini Pro'
    }
    return labels[model] || model
  }

  const getModelDescription = (model: string) => {
    const descriptions: Record<string, string> = {
      'gpt-4o': 'Most capable, best for complex tasks',
      'gpt-4o-mini': 'Fast and efficient, great for most tasks',
      'claude-3-5-sonnet': 'Balanced performance and speed',
      'claude-3-opus': 'Most powerful, best quality',
      'gemini-pro': 'Google\'s advanced model'
    }
    return descriptions[model] || ''
  }

  if (loading) {
    return (
      <div className={`flex items-center gap-2 text-sm text-slate-400 ${className}`}>
        <Sparkles className="w-4 h-4 animate-pulse" />
        <span>Loading models...</span>
      </div>
    )
  }

  if (availableModels.length <= 1) {
    return null
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        AI Model
      </label>
      <select
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {availableModels.map((model) => (
          <option key={model} value={model}>
            {getModelLabel(model)}
          </option>
        ))}
      </select>
      {selectedModel && (
        <p className="text-xs text-slate-400 mt-1">
          {getModelDescription(selectedModel)}
        </p>
      )}
    </div>
  )
}

