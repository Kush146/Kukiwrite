'use client'

import Link from 'next/link'
import { Button } from './Button'

export function UpgradeBanner() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg mb-1">Upgrade to Pro</h3>
          <p className="text-sm opacity-90">
            Get unlimited generations and access to all premium features.
          </p>
        </div>
        <Link href="/billing">
          <Button variant="outline" size="sm" className="bg-white text-blue-600 hover:bg-gray-100">
            Upgrade Now
          </Button>
        </Link>
      </div>
    </div>
  )
}

