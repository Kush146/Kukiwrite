'use client'

interface UsageBarProps {
  used: number
  limit: number
  plan: 'FREE' | 'PRO'
}

export function UsageBar({ used, limit, plan }: UsageBarProps) {
  const percentage = Math.min((used / limit) * 100, 100)
  const isNearLimit = percentage >= 80

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1 text-slate-300">
        <span>
          {used} / {limit} generations this month
        </span>
        <span className={isNearLimit ? 'text-orange-400 font-medium' : 'text-slate-300'}>
          {plan} Plan
        </span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ease-out relative ${
            isNearLimit 
              ? 'bg-gradient-to-r from-orange-400 to-red-500' 
              : 'bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500'
          }`}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
        </div>
      </div>
      {isNearLimit && plan === 'FREE' && (
        <p className="text-xs text-orange-400 mt-1">
          You're running low on generations. Consider upgrading to Pro for unlimited access.
        </p>
      )}
    </div>
  )
}

