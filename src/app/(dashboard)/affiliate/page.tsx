'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CopyButton } from '@/components/ui/CopyButton'
import { useToast } from '@/components/ui/Toast'
import { Gift, Copy, Users, DollarSign, TrendingUp, Loader2 } from 'lucide-react'

export default function AffiliatePage() {
  const [referralData, setReferralData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const { showToast } = useToast()

  useEffect(() => {
    fetchReferralData()
  }, [])

  const fetchReferralData = async () => {
    try {
      const response = await fetch('/api/affiliate/referral')
      if (response.ok) {
        const data = await response.json()
        setReferralData(data)
      }
    } catch (error) {
      console.error('Failed to fetch referral data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = () => {
    if (referralData?.referralLink) {
      navigator.clipboard.writeText(referralData.referralLink)
      showToast('Referral link copied!', 'success')
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
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Affiliate Program
        </h1>
        <p className="text-slate-300">
          Earn rewards by referring friends to Kukiwrite
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="w-5 h-5 text-green-400" />
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">
              ${(referralData?.earnings || 0).toFixed(2)}
            </div>
            <p className="text-sm text-slate-400 mt-2">Lifetime earnings</p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-blue-400" />
              Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">
              {referralData?.referrals?.length || 0}
            </div>
            <p className="text-sm text-slate-400 mt-2">Total referrals</p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">
              {referralData?.referrals?.filter((r: any) => r.status === 'completed').length || 0}
            </div>
            <p className="text-sm text-slate-400 mt-2">Completed signups</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Your Referral Link
          </CardTitle>
          <CardDescription>
            Share this link with friends and earn rewards when they sign up
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={referralData?.referralLink || ''}
              readOnly
              className="bg-slate-800 border-slate-700"
            />
            <CopyButton text={referralData?.referralLink || ''} />
          </div>
          <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
            <p className="text-sm text-blue-300">
              <strong>How it works:</strong> Share your referral link. When someone signs up using your link and subscribes to Pro, you earn a commission!
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
          <CardDescription>Track your referrals and earnings</CardDescription>
        </CardHeader>
        <CardContent>
          {referralData?.referrals && referralData.referrals.length > 0 ? (
            <div className="space-y-4">
              {referralData.referrals.map((referral: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold">{referral.referred?.name || referral.referred?.email || 'Unknown'}</p>
                    <p className="text-sm text-slate-400">
                      {new Date(referral.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        referral.status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : referral.status === 'paid'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {referral.status}
                    </span>
                    {referral.earnings > 0 && (
                      <p className="text-sm text-green-400 mt-1">${referral.earnings.toFixed(2)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No referrals yet. Start sharing your link!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

