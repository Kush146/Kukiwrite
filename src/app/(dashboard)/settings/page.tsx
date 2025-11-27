'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Upload, X, Loader2 } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [image, setImage] = useState('')
  const [phone, setPhone] = useState('')
  const [headline, setHeadline] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setName(data.name || '')
        setEmail(data.email || '')
        setImage(data.image || '')
        setPhone(data.phone || '')
        setHeadline(data.headline || '')
        setBio(data.bio || '')
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage('Please select an image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('Image size must be less than 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    handleImageUpload(file)
  }

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image')
      }

      setImage(data.url)
      setMessage('Image uploaded successfully! Click "Save Changes" to update your profile.')
    } catch (error: any) {
      setMessage(error.message || 'Failed to upload image')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setImage('')
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, image, phone, headline, bio })
      })

      if (response.ok) {
        setMessage('Profile updated successfully')
        setPreview(null)
        // Refresh server components to update the top nav
        router.refresh()
      } else {
        const data = await response.json()
        setMessage(data.error || 'Failed to update profile')
      }
    } catch (error) {
      setMessage('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-slate-300">Manage your account settings and preferences.</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your account profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-4">
            {message && (
              <div
                className={`p-3 rounded ${
                  message.includes('success')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {message}
              </div>
            )}
            <div className="flex items-start gap-6">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-2xl font-semibold uppercase overflow-hidden border-2 border-slate-700">
                    {preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image} alt={name || 'Avatar'} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-slate-400">{name?.[0] || email?.[0] || 'K'}</span>
                    )}
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-white" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="avatar-upload"
                    disabled={uploading}
                  />
                  <label htmlFor="avatar-upload" className="cursor-pointer w-full">
                    <div className="w-full px-3 py-2 text-sm font-medium text-center border border-slate-700 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4" />
                      {uploading ? 'Uploading...' : 'Upload Photo'}
                    </div>
                  </label>
                  {(image || preview) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveImage}
                      className="w-full text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Display Name
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
                <div>
                  <label htmlFor="image-url" className="block text-sm font-medium mb-1">
                    Profile Photo URL (Alternative)
                  </label>
                  <Input
                    id="image-url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Or paste an image URL here"
                    className="bg-slate-800 border-slate-700"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    You can upload an image above or paste a URL here
                  </p>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input id="email" value={email} disabled className="bg-gray-50" />
              <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Phone
                </label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label htmlFor="headline" className="block text-sm font-medium mb-1">
                  Headline
                </label>
                <Input
                  id="headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Fullstack Developer · AI Tools"
                />
              </div>
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium mb-1">
                Bio
              </label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell people a little about yourself..."
                rows={4}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Help & Support</CardTitle>
          <CardDescription>Get help and learn how to use Kukiwrite</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Onboarding Tour</h3>
            <p className="text-sm text-slate-300 mb-3">
              Take a quick tour to learn about all features and how to use them.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem('hasSeenOnboardingTour')
                window.dispatchEvent(new CustomEvent('showOnboardingTour'))
              }}
            >
              Show Tour Again
            </Button>
          </div>
          <div className="pt-4 border-t border-slate-700">
            <h3 className="font-semibold mb-2">Keyboard Shortcuts</h3>
            <p className="text-sm text-slate-300 mb-2">
              Press <kbd className="px-2 py-1 bg-slate-800 rounded text-xs">Cmd/Ctrl + K</kbd> to open the command palette
            </p>
            <p className="text-sm text-slate-300">
              Press <kbd className="px-2 py-1 bg-slate-800 rounded text-xs">Cmd/Ctrl + Shift + ?</kbd> to view all shortcuts
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

