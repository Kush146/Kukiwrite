'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/components/ui/Toast'
import { Users, Plus, UserPlus, Crown, Shield, Edit, Eye, Loader2 } from 'lucide-react'

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [teamDescription, setTeamDescription] = useState('')

  const { showToast } = useToast()

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams')
      if (response.ok) {
        const data = await response.json()
        setTeams(data.teams || [])
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      showToast('Please enter a team name', 'error')
      return
    }

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: teamName,
          description: teamDescription
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create team')
      }

      showToast('Team created successfully!', 'success')
      setShowCreateModal(false)
      setTeamName('')
      setTeamDescription('')
      fetchTeams()
    } catch (error: any) {
      showToast(error.message || 'Failed to create team', 'error')
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
            Teams
          </h1>
          <p className="text-slate-300">
            Collaborate with your team on content creation
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Team
        </Button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create New Team</CardTitle>
              <CardDescription>Start collaborating with your team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Team Name *</label>
                <Input
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g., Marketing Team"
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  placeholder="What is this team for?"
                  rows={3}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateTeam}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500"
                >
                  Create Team
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowCreateModal(false)
                    setTeamName('')
                    setTeamDescription('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {teams.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {teams.map((team) => (
            <Card key={team.id} className="hover-lift">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {team.name}
                  </CardTitle>
                  {team.role === 'owner' && (
                    <Crown className="w-5 h-5 text-yellow-400" />
                  )}
                </div>
                <CardDescription>{team.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Members</span>
                    <span className="font-semibold">{team.memberCount || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Your Role</span>
                    <span className="font-semibold capitalize">{team.role}</span>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full mt-4"
                    onClick={() => showToast('Team management coming soon!', 'info')}
                  >
                    Manage Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50 text-slate-400" />
            <p className="text-slate-400 mb-4">No teams yet. Create your first team to get started!</p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

