'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { Key, Plus, Trash2, Copy, Loader2, ExternalLink, Shield } from 'lucide-react'
import { CopyButton } from '@/components/ui/CopyButton'

export default function APIPage() {
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKey, setNewKey] = useState<string | null>(null)

  const { showToast } = useToast()

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/api-keys')
      if (response.ok) {
        const data = await response.json()
        setApiKeys(data.apiKeys || [])
      } else if (response.status === 403) {
        showToast('API access requires Pro plan', 'error')
      }
    } catch (error) {
      console.error('Failed to fetch API keys:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      showToast('Please enter a name for the API key', 'error')
      return
    }

    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create API key')
      }

      setNewKey(data.apiKey.key)
      setNewKeyName('')
      showToast('API key created! Save it now - you won\'t see it again.', 'success')
      fetchApiKeys()
    } catch (error: any) {
      showToast(error.message || 'Failed to create API key', 'error')
    }
  }

  const handleDeleteKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) {
      return
    }

    try {
      const response = await fetch(`/api/api-keys/${keyId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete API key')
      }

      showToast('API key deleted', 'success')
      fetchApiKeys()
    } catch (error: any) {
      showToast(error.message || 'Failed to delete API key', 'error')
    }
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
            API Access
          </h1>
          <p className="text-slate-300">
            Manage your API keys for programmatic access
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create API Key
        </Button>
      </div>

      {newKey && (
        <Card className="mb-6 border-yellow-500/50 bg-yellow-500/10">
          <CardHeader>
            <CardTitle className="text-yellow-400">⚠️ Save Your API Key</CardTitle>
            <CardDescription className="text-yellow-300">
              This is the only time you'll see this key. Copy it now!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={newKey}
                readOnly
                className="bg-slate-800 border-yellow-500/50 font-mono"
              />
              <CopyButton text={newKey} />
            </div>
            <Button
              variant="ghost"
              onClick={() => setNewKey(null)}
              className="mt-4"
            >
              I've saved it
            </Button>
          </CardContent>
        </Card>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create API Key</CardTitle>
              <CardDescription>Give your API key a descriptive name</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Key Name *</label>
                <Input
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production API Key"
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateKey}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500"
                >
                  Create Key
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowCreateModal(false)
                    setNewKeyName('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>Manage your API keys for programmatic access</CardDescription>
        </CardHeader>
        <CardContent>
          {apiKeys.length > 0 ? (
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="p-4 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Key className="w-4 h-4 text-blue-400" />
                      <span className="font-semibold">{key.name}</span>
                    </div>
                    <div className="text-sm text-slate-400 space-y-1">
                      <p>Key: {key.key}</p>
                      <p>Created: {new Date(key.createdAt).toLocaleDateString()}</p>
                      {key.lastUsed && (
                        <p>Last used: {new Date(key.lastUsed).toLocaleDateString()}</p>
                      )}
                      {key.expiresAt && (
                        <p>Expires: {new Date(key.expiresAt).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteKey(key.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <Key className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No API keys yet. Create one to get started!</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-slate-300">
            <div>
              <p className="font-semibold mb-2">Base URL</p>
              <code className="block p-2 bg-slate-800 rounded text-blue-400">
                {typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api/v1
              </code>
            </div>
            <div>
              <p className="font-semibold mb-2">Authentication</p>
              <p className="mb-2">Include your API key in the Authorization header:</p>
              <code className="block p-2 bg-slate-800 rounded text-blue-400">
                Authorization: Bearer YOUR_API_KEY
              </code>
            </div>
            <div>
              <p className="font-semibold mb-2">Endpoints</p>
              <ul className="space-y-2 ml-4">
                <li><code className="text-blue-400">POST /generate/blog</code> - Generate blog post</li>
                <li><code className="text-blue-400">POST /generate/youtube</code> - Generate YouTube script</li>
                <li><code className="text-blue-400">GET /generations</code> - List your generations</li>
                <li><code className="text-blue-400">GET /usage</code> - Check usage limits</li>
              </ul>
            </div>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => showToast('Full API documentation coming soon!', 'info')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Full Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

