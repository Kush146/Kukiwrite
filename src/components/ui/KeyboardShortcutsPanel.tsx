'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { Button } from './Button'
import { X, Keyboard } from 'lucide-react'

const shortcuts = [
  { category: 'Navigation', keys: [
    { key: 'Ctrl/Cmd + K', description: 'Open command palette' },
    { key: 'Ctrl/Cmd + D', description: 'Go to Dashboard' },
    { key: 'Ctrl/Cmd + H', description: 'Go to History' },
    { key: 'Ctrl/Cmd + S', description: 'Go to Settings' },
    { key: 'Ctrl/Cmd + B', description: 'Go to Billing' },
    { key: 'Ctrl/Cmd + A', description: 'Go to Analytics' },
  ]},
  { category: 'Actions', keys: [
    { key: 'Esc', description: 'Close modals/dialogs' },
    { key: 'Ctrl/Cmd + C', description: 'Copy selected text' },
    { key: 'Ctrl/Cmd + Enter', description: 'Submit form' },
  ]}
]

export function KeyboardShortcutsPanel() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === '?') {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => setOpen(false)}
    >
      <Card
        className="w-full max-w-2xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Keyboard className="w-5 h-5" />
              <CardTitle>Keyboard Shortcuts</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {shortcuts.map((category) => (
              <div key={category.category}>
                <h3 className="font-semibold text-lg mb-3 text-slate-200">{category.category}</h3>
                <div className="space-y-2">
                  {category.keys.map((shortcut, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                      <span className="text-slate-300">{shortcut.description}</span>
                      <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs font-mono text-slate-200">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-slate-300">
              <strong>Tip:</strong> Press <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs font-mono">Ctrl/Cmd + Shift + ?</kbd> to open this panel anytime
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



