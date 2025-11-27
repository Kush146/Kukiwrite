'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from './Card'
import { Input } from './Input'
import { useToast } from './Toast'
import { Search, FileText, Video, Search as SearchIcon, RefreshCw, Instagram, LayoutDashboard, History, BarChart3, Settings, CreditCard, X } from 'lucide-react'

interface Command {
  id: string
  label: string
  icon: any
  action: () => void
  category: string
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()
  const { showToast } = useToast()

  const commands: Command[] = [
    { id: 'dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, action: () => router.push('/dashboard'), category: 'Navigation' },
    { id: 'history', label: 'View History', icon: History, action: () => router.push('/history'), category: 'Navigation' },
    { id: 'analytics', label: 'View Analytics', icon: BarChart3, action: () => router.push('/analytics'), category: 'Navigation' },
    { id: 'settings', label: 'Settings', icon: Settings, action: () => router.push('/settings'), category: 'Navigation' },
    { id: 'billing', label: 'Billing', icon: CreditCard, action: () => router.push('/billing'), category: 'Navigation' },
    { id: 'blog', label: 'Blog Tool', icon: FileText, action: () => router.push('/tools/blog'), category: 'Tools' },
    { id: 'youtube', label: 'YouTube Tool', icon: Video, action: () => router.push('/tools/youtube'), category: 'Tools' },
    { id: 'seo', label: 'SEO Tool', icon: SearchIcon, action: () => router.push('/tools/seo'), category: 'Tools' },
    { id: 'instagram', label: 'Instagram Tool', icon: Instagram, action: () => router.push('/tools/instagram'), category: 'Tools' },
    { id: 'rewriter', label: 'Rewriter Tool', icon: RefreshCw, action: () => router.push('/tools/rewriter'), category: 'Tools' },
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape' && open) {
        setOpen(false)
        setQuery('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  )

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = []
    acc[cmd.category].push(cmd)
    return acc
  }, {} as Record<string, Command[]>)

  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh] px-4"
      onClick={() => {
        setOpen(false)
        setQuery('')
      }}
    >
      <Card
        className="w-full max-w-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent className="p-0">
          <div className="flex items-center gap-2 p-4 border-b border-slate-800">
            <Search className="w-5 h-5 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search..."
              className="border-0 bg-transparent focus-visible:ring-0 text-lg"
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setOpen(false)
                setQuery('')
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="max-h-96 overflow-y-auto p-2">
            {Object.entries(groupedCommands).map(([category, cmds]) => (
              <div key={category} className="mb-4">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
                  {category}
                </div>
                {cmds.map((cmd) => {
                  const Icon = cmd.icon
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        cmd.action()
                        setOpen(false)
                        setQuery('')
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-colors text-left group"
                    >
                      <Icon className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                      <span className="text-slate-200 group-hover:text-white">{cmd.label}</span>
                    </button>
                  )
                })}
              </div>
            ))}
            {filteredCommands.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                No commands found
              </div>
            )}
          </div>
          <div className="border-t border-slate-800 p-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Press Esc to close</span>
            <span>↑↓ to navigate • Enter to select</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



