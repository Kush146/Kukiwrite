'use client'

import { useState, useEffect, useRef } from 'react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { NotificationsCenter } from '@/components/ui/NotificationsCenter'
import { User, X, Mail, Phone, Briefcase, FileText, HelpCircle } from 'lucide-react'

interface TopNavProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

interface ProfileData {
  name?: string | null
  email?: string | null
  image?: string | null
  phone?: string | null
  headline?: string | null
  bio?: string | null
}

export function TopNav({ user }: TopNavProps) {
  const router = useRouter()
  const [showProfile, setShowProfile] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleShowTour = () => {
    // Remove the flag and trigger tour
    localStorage.removeItem('hasSeenOnboardingTour')
    // Dispatch custom event to trigger tour
    window.dispatchEvent(new CustomEvent('showOnboardingTour'))
  }

  useEffect(() => {
    if (showProfile) {
      fetchProfile()
    }
  }, [showProfile])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfile(false)
      }
    }

    if (showProfile) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProfile])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setProfileData(data)
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  }

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/70 backdrop-blur-sm fixed top-0 right-0 left-0 md:left-64 z-10 text-slate-200 shadow-lg shadow-black/10">
      <div className="h-full px-6 flex items-center justify-end gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShowTour}
          className="relative"
          title="User Guide & Tour"
        >
          <HelpCircle className="w-5 h-5" />
        </Button>
        <NotificationsCenter />
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center space-x-2 text-sm hover:opacity-80 transition-opacity"
          >
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || 'User'}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                <User className="w-4 h-4 text-slate-400" />
              </div>
            )}
            <span className="font-medium">{user?.name || user?.email || 'User'}</span>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-800 rounded-lg shadow-xl z-50">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-semibold text-lg">Profile</h3>
                <button
                  onClick={() => setShowProfile(false)}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {profileData ? (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-xl font-semibold uppercase overflow-hidden flex-shrink-0">
                        {profileData.image ? (
                          <img
                            src={profileData.image}
                            alt={profileData.name || 'Avatar'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{profileData.name?.[0] || profileData.email?.[0] || 'U'}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-lg truncate">
                          {profileData.name || 'No name'}
                        </h4>
                        {profileData.headline && (
                          <p className="text-sm text-slate-400 truncate">{profileData.headline}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {profileData.email && (
                        <div className="flex items-start gap-3">
                          <Mail className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-400 mb-0.5">Email</p>
                            <p className="text-sm truncate">{profileData.email}</p>
                          </div>
                        </div>
                      )}

                      {profileData.phone && (
                        <div className="flex items-start gap-3">
                          <Phone className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-400 mb-0.5">Phone</p>
                            <p className="text-sm">{profileData.phone}</p>
                          </div>
                        </div>
                      )}

                      {profileData.headline && (
                        <div className="flex items-start gap-3">
                          <Briefcase className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-400 mb-0.5">Headline</p>
                            <p className="text-sm">{profileData.headline}</p>
                          </div>
                        </div>
                      )}

                      {profileData.bio && (
                        <div className="flex items-start gap-3">
                          <FileText className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-400 mb-0.5">Bio</p>
                            <p className="text-sm whitespace-pre-wrap">{profileData.bio}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center text-slate-400 py-4">Loading profile...</div>
                )}
              </div>
              <div className="p-4 border-t border-slate-800 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setShowProfile(false)
                    router.push('/settings')
                  }}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                >
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

