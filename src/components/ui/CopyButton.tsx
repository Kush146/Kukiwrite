'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from './Button'
import { useToast } from './Toast'

interface CopyButtonProps {
  text: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function CopyButton({ text, variant = 'outline', size = 'sm', className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const { showToast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      showToast('Copied to clipboard!', 'success', 2000)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      showToast('Failed to copy', 'error')
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={className}
      disabled={!text}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Copied
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </>
      )}
    </Button>
  )
}

