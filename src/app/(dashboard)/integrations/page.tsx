'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { Plug, CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react'

export default function IntegrationsPage() {
  const [platforms, setPlatforms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const { showToast } = useToast()

  useEffect(() => {
    fetchPlatforms()
  }, [])

  const fetchPlatforms = async () => {
    try {
      const response = await fetch('/api/integrations/platforms')
      if (response.ok) {
        const data = await response.json()
        setPlatforms(data.platforms || [])
      }
    } catch (error) {
      console.error('Failed to fetch platforms:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (platform: any) => {
    showToast(`Connecting to ${platform.name}...`, 'info')
    // In production, this would redirect to OAuth flow
    // For now, show a message
    setTimeout(() => {
      showToast(`${platform.name} connection coming soon!`, 'info')
    }, 1000)
  }

  const handleDisconnect = async (platform: any) => {
    showToast(`Disconnecting from ${platform.name}...`, 'info')
    // API call to disconnect
    setTimeout(() => {
      showToast(`Disconnected from ${platform.name}`, 'success')
      fetchPlatforms()
    }, 1000)
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
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Integrations
        </h1>
        <p className="text-slate-300">
          Connect your platforms for automatic content posting
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {platforms.map((platform) => (
          <Card key={platform.id} className="hover-lift">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{platform.icon}</span>
                  <div>
                    <CardTitle>{platform.name}</CardTitle>
                    <CardDescription>
                      {platform.connected ? 'Connected' : 'Not connected'}
                    </CardDescription>
                  </div>
                </div>
                {platform.connected ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-slate-400" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-slate-300">
                  {platform.id === 'wordpress' && 'Post directly to your WordPress site'}
                  {platform.id === 'medium' && 'Publish articles to Medium'}
                  {platform.id === 'linkedin' && 'Share content on LinkedIn'}
                  {platform.id === 'twitter' && 'Tweet your content automatically'}
                </p>
                {platform.connected ? (
                  <Button
                    variant="outline"
                    onClick={() => handleDisconnect(platform)}
                    className="w-full"
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleConnect(platform)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
                  >
                    <Plug className="w-4 h-4 mr-2" />
                    Connect {platform.name}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-semibold mb-1">Connect Your Platforms</p>
                <p>Click "Connect" on any platform to authorize Kukiwrite to post on your behalf.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-semibold mb-1">Generate Content</p>
                <p>Create your content using any of Kukiwrite's tools.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-semibold mb-1">Auto-Post</p>
                <p>Select your connected platforms and post with one click, or schedule for later.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

