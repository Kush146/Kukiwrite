'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { UsageBar } from '@/components/ui/UsageBar'
import { Check } from 'lucide-react'

export default function BillingPage() {
  const [plan, setPlan] = useState<'FREE' | 'PRO'>('FREE')
  const [usage, setUsage] = useState({ used: 0, limit: 50 })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUsage()
  }, [])

  const fetchUsage = async () => {
    try {
      const response = await fetch('/api/user/usage')
      if (response.ok) {
        const data = await response.json()
        setPlan(data.plan)
        setUsage({ used: data.usage, limit: data.limit })
      }
    } catch (error) {
      console.error('Failed to fetch usage:', error)
    }
  }

  const handleUpgrade = async () => {
    // Pro billing via Stripe is disabled for now
    alert('Pro subscriptions are coming soon. For now you can use the Free plan.')
  }

  const handleManageBilling = async () => {
    alert('Billing portal is not enabled yet.')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Billing & Usage</h1>
        <p className="text-slate-300">Manage your subscription and view usage statistics.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your active subscription plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="text-3xl font-bold mb-2">FREE</div>
              <p className="text-slate-300">Free · 50 generations/month</p>
            </div>
            <Button disabled className="w-full" variant="outline">
              Pro plan coming soon
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage This Month</CardTitle>
            <CardDescription>Your generation usage for the current billing period</CardDescription>
          </CardHeader>
          <CardContent>
            <UsageBar used={usage.used} limit={usage.limit} plan={plan} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plan Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Free Plan</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  50 generations per month
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  All AI tools included
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  Basic support
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Pro Plan</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  Unlimited generations
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  All AI tools included
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  Priority support
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  Advanced features
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

