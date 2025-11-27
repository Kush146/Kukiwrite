'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/components/ui/Toast'
import { Mic, Plus, Star, Trash2, Edit, Loader2 } from 'lucide-react'

export default function BrandVoicesPage() {
  const [voices, setVoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingVoice, setEditingVoice] = useState<any>(null)
  const [voiceData, setVoiceData] = useState({
    name: '',
    description: '',
    guidelines: '',
    examples: '',
    isDefault: false
  })

  const { showToast } = useToast()

  useEffect(() => {
    fetchVoices()
  }, [])

  const fetchVoices = async () => {
    try {
      const response = await fetch('/api/brand-voices')
      if (response.ok) {
        const data = await response.json()
        setVoices(data.voices || [])
      }
    } catch (error) {
      console.error('Failed to fetch brand voices:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!voiceData.name || !voiceData.guidelines) {
      showToast('Name and guidelines are required', 'error')
      return
    }

    try {
      const url = editingVoice ? `/api/brand-voices/${editingVoice.id}` : '/api/brand-voices'
      const method = editingVoice ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...voiceData,
          examples: voiceData.examples.split('\n').filter(Boolean)
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save brand voice')
      }

      showToast(editingVoice ? 'Brand voice updated!' : 'Brand voice created!', 'success')
      setShowCreateModal(false)
      setEditingVoice(null)
      setVoiceData({
        name: '',
        description: '',
        guidelines: '',
        examples: '',
        isDefault: false
      })
      fetchVoices()
    } catch (error: any) {
      showToast(error.message || 'Failed to save brand voice', 'error')
    }
  }

  const handleDelete = async (voiceId: string) => {
    if (!confirm('Are you sure you want to delete this brand voice?')) {
      return
    }

    try {
      const response = await fetch(`/api/brand-voices/${voiceId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete brand voice')
      }

      showToast('Brand voice deleted', 'success')
      fetchVoices()
    } catch (error: any) {
      showToast(error.message || 'Failed to delete brand voice', 'error')
    }
  }

  const handleEdit = (voice: any) => {
    setEditingVoice(voice)
    setVoiceData({
      name: voice.name,
      description: voice.description || '',
      guidelines: voice.guidelines,
      examples: voice.examples?.join('\n') || '',
      isDefault: voice.isDefault
    })
    setShowCreateModal(true)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Brand Voices
          </h1>
          <p className="text-slate-300">
            Train AI on your brand's unique voice and style
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingVoice(null)
            setVoiceData({
              name: '',
              description: '',
              guidelines: '',
              examples: '',
              isDefault: false
            })
            setShowCreateModal(true)
          }}
          className="bg-gradient-to-r from-blue-500 to-purple-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Brand Voice
        </Button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl my-8">
            <CardHeader>
              <CardTitle>{editingVoice ? 'Edit' : 'Create'} Brand Voice</CardTitle>
              <CardDescription>
                Define your brand's unique voice, tone, and style guidelines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <Input
                  value={voiceData.name}
                  onChange={(e) => setVoiceData({ ...voiceData, name: e.target.value })}
                  placeholder="e.g., Professional, Casual, Friendly"
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={voiceData.description}
                  onChange={(e) => setVoiceData({ ...voiceData, description: e.target.value })}
                  placeholder="Brief description of this brand voice..."
                  rows={2}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Guidelines *</label>
                <Textarea
                  value={voiceData.guidelines}
                  onChange={(e) => setVoiceData({ ...voiceData, guidelines: e.target.value })}
                  placeholder="Describe your brand voice: tone, style, vocabulary, do's and don'ts..."
                  rows={6}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Example Content</label>
                <Textarea
                  value={voiceData.examples}
                  onChange={(e) => setVoiceData({ ...voiceData, examples: e.target.value })}
                  placeholder="Paste example content that represents your brand voice (one per line)..."
                  rows={4}
                  className="bg-slate-800 border-slate-700"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Provide examples of content that matches your brand voice
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={voiceData.isDefault}
                  onChange={(e) => setVoiceData({ ...voiceData, isDefault: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isDefault" className="text-sm">
                  Set as default brand voice
                </label>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500"
                >
                  {editingVoice ? 'Update' : 'Create'} Brand Voice
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingVoice(null)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {voices.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {voices.map((voice) => (
            <Card key={voice.id} className="hover-lift">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-5 h-5 text-blue-400" />
                    <CardTitle>{voice.name}</CardTitle>
                    {voice.isDefault && (
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(voice)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(voice.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {voice.description && (
                  <CardDescription>{voice.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold mb-1">Guidelines</p>
                    <p className="text-sm text-slate-300 line-clamp-3">
                      {voice.guidelines}
                    </p>
                  </div>
                  {voice.examples && voice.examples.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-1">
                        Examples ({voice.examples.length})
                      </p>
                      <p className="text-xs text-slate-400">
                        {voice.examples.length} example{voice.examples.length !== 1 ? 's' : ''} provided
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Mic className="w-12 h-12 mx-auto mb-4 opacity-50 text-slate-400" />
            <p className="text-slate-400 mb-4">
              No brand voices yet. Create one to train AI on your brand style!
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Brand Voice
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

