'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from './Toast'

interface Shortcut {
  key: string
  description: string
  action: () => void
  ctrl?: boolean
  shift?: boolean
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  const router = useRouter()
  const { showToast } = useToast()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return
      }

      shortcuts.forEach((shortcut) => {
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase()

        if (ctrlMatch && shiftMatch && keyMatch) {
          e.preventDefault()
          shortcut.action()
        }
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

export function GlobalKeyboardShortcuts() {
  const router = useRouter()
  const { showToast } = useToast()

  useKeyboardShortcuts([
    {
      key: 'k',
      description: 'Search',
      ctrl: true,
      action: () => {
        showToast('Search coming soon!', 'info')
      }
    },
    {
      key: 'h',
      description: 'Go to History',
      ctrl: true,
      action: () => {
        router.push('/history')
      }
    },
    {
      key: 'd',
      description: 'Go to Dashboard',
      ctrl: true,
      action: () => {
        router.push('/dashboard')
      }
    }
  ])

  return null
}

