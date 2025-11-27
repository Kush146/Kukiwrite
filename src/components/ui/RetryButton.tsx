'use client'

import { useState } from 'react'
import { Button } from './Button'
import { RefreshCw, AlertCircle } from 'lucide-react'
import { useToast } from './Toast'

interface RetryButtonProps {
  onRetry: () => Promise<void>
  error?: string
  className?: string
}

export function RetryButton({ onRetry, error, className }: RetryButtonProps) {
  const [retrying, setRetrying] = useState(false)
  const { showToast } = useToast()

  const handleRetry = async () => {
    setRetrying(true)
    try {
      await onRetry()
      showToast('Retry successful', 'success')
    } catch (err: any) {
      showToast(err.message || 'Retry failed', 'error')
    } finally {
      setRetrying(false)
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300 flex-1">{error}</p>
        </div>
      )}
      <Button
        variant="outline"
        onClick={handleRetry}
        disabled={retrying}
        className="w-full"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${retrying ? 'animate-spin' : ''}`} />
        {retrying ? 'Retrying...' : 'Retry'}
      </Button>
    </div>
  )
}



