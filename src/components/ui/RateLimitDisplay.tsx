'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card'
import { AlertCircle, CheckCircle, Clock } from 'lucide-react'

interface RateLimitInfo {
  remaining: number
  limit: number
  resetAt: Date
  window: 'minute' | 'hour' | 'day'
}

export function RateLimitDisplay() {
  const [rateLimit, setRateLimit] = useState<RateLimitInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRateLimit()
    const interval = setInterval(fetchRateLimit, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchRateLimit = async () => {
    try {
      const response = await fetch('/api/rate-limit')
      if (response.ok) {
        const data = await response.json()
        setRateLimit({
          remaining: data.remaining,
          limit: data.limit,
          resetAt: new Date(data.resetAt),
          window: data.window
        })
      }
    } catch (error) {
      console.error('Failed to fetch rate limit:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !rateLimit) {
    return null
  }

  const percentage = (rateLimit.remaining / rateLimit.limit) * 100
  const isLow = percentage < 20
  const isWarning = percentage < 50

  const formatResetTime = () => {
    const now = new Date()
    const diff = rateLimit.resetAt.getTime() - now.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    }
    return `${minutes}m`
  }

  return (
    <Card className={`${isLow ? 'border-red-500/50 bg-red-500/5' : isWarning ? 'border-orange-500/50 bg-orange-500/5' : 'border-blue-500/50 bg-blue-500/5'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isLow ? (
              <AlertCircle className="w-5 h-5 text-red-400" />
            ) : isWarning ? (
              <AlertCircle className="w-5 h-5 text-orange-400" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-400" />
            )}
            <CardTitle className="text-sm">API Rate Limit</CardTitle>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="w-3 h-3" />
            Resets in {formatResetTime()}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">Remaining</span>
            <span className={`font-semibold ${isLow ? 'text-red-400' : isWarning ? 'text-orange-400' : 'text-green-400'}`}>
              {rateLimit.remaining} / {rateLimit.limit}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isLow ? 'bg-red-500' : isWarning ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-slate-400">
            {rateLimit.window === 'minute' ? 'Per minute' : rateLimit.window === 'hour' ? 'Per hour' : 'Per day'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}



