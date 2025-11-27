'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { X, ArrowRight, ArrowLeft, Sparkles, FileText, Users, Gift, Zap, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Step {
  id: string
  title: string
  description: string
  icon?: React.ReactNode
  highlight?: string
  action?: {
    label: string
    href?: string
  }
}

const steps: Step[] = [
  {
    id: 'welcome',
    title: 'Welcome to Kukiwrite! 🎉',
    description: 'Your all-in-one AI-powered content generation platform. Let\'s take a quick 2-minute tour to show you everything you can do!',
    icon: <Sparkles className="w-6 h-6 text-yellow-400" />
  },
  {
    id: 'dashboard',
    title: 'Your Dashboard',
    description: 'Here you can see your usage stats, recent content, and quick access to all tools. Track your generations and monitor your plan limits.',
    icon: <FileText className="w-6 h-6 text-blue-400" />
  },
  {
    id: 'tools',
    title: '13+ AI Content Tools',
    description: 'Generate blog posts, YouTube scripts, SEO content, Instagram posts, translations, and more! Each tool is optimized for its specific use case.',
    icon: <Zap className="w-6 h-6 text-purple-400" />,
    action: {
      label: 'Try a Tool',
      href: '/tools/blog'
    }
  },
  {
    id: 'features',
    title: 'Powerful Features',
    description: '• Multi-AI Models (GPT-4, Claude)\n• Plagiarism Checker\n• Sentiment Analysis\n• Translation (30+ languages)\n• Content Scoring\n• Brand Voice Training',
    icon: <CheckCircle className="w-6 h-6 text-green-400" />
  },
  {
    id: 'collaboration',
    title: 'Team Collaboration',
    description: 'Create teams, invite members, and collaborate on content. Perfect for agencies and marketing teams!',
    icon: <Users className="w-6 h-6 text-pink-400" />,
    action: {
      label: 'Create Team',
      href: '/teams'
    }
  },
  {
    id: 'integrations',
    title: 'Auto-Post to Platforms',
    description: 'Connect WordPress, Medium, LinkedIn, and Twitter. Generate content and publish automatically!',
    icon: <Zap className="w-6 h-6 text-orange-400" />,
    action: {
      label: 'View Integrations',
      href: '/integrations'
    }
  },
  {
    id: 'affiliate',
    title: 'Earn with Affiliate Program',
    description: 'Share Kukiwrite with others and earn rewards! Get your unique referral link and start earning.',
    icon: <Gift className="w-6 h-6 text-yellow-400" />,
    action: {
      label: 'Get Started',
      href: '/affiliate'
    }
  },
  {
    id: 'complete',
    title: 'You\'re All Set! 🚀',
    description: 'Start creating amazing content! Use Cmd/Ctrl+K for quick navigation, and check the Help section if you need assistance.',
    icon: <Sparkles className="w-6 h-6 text-blue-400" />
  }
]

export function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Listen for custom event to show tour (from user guide button)
    const handleShowTour = () => {
      setIsOpen(true)
      setCurrentStep(0)
    }

    window.addEventListener('showOnboardingTour', handleShowTour)

    // Check if user has seen the tour (only on initial load)
    const hasSeenTour = localStorage.getItem('hasSeenOnboardingTour')
    if (!hasSeenTour) {
      // Small delay to ensure page is loaded
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 1500)
      return () => {
        clearTimeout(timer)
        window.removeEventListener('showOnboardingTour', handleShowTour)
      }
    }

    return () => {
      window.removeEventListener('showOnboardingTour', handleShowTour)
    }
  }, [])

  useEffect(() => {
    // Scroll to top when step changes
    if (isOpen && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [currentStep, isOpen])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    localStorage.setItem('hasSeenOnboardingTour', 'true')
    localStorage.setItem('hasSeenOnboardingTourDate', new Date().toISOString())
    setIsOpen(false)
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleAction = () => {
    const step = steps[currentStep]
    if (step.action?.href) {
      handleComplete()
      router.push(step.action.href)
    }
  }

  if (!isOpen) return null

  const step = steps[currentStep]
  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <Card
        ref={cardRef}
        className="w-full max-w-lg bg-slate-900 border-2 border-blue-500/50 shadow-2xl animate-fade-in"
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {step.icon}
              <div>
                <h3 className="text-xl font-bold text-white">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="text-slate-400 hover:text-white transition-colors p-1"
              aria-label="Close tour"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="mb-6 min-h-[120px]">
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {step.description}
            </p>
          </div>

          {/* Action Button */}
          {step.action && !isLast && (
            <div className="mb-4">
              <Button
                onClick={handleAction}
                variant="outline"
                className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
              >
                {step.action.label}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3">
            <Button
              onClick={handlePrevious}
              variant="ghost"
              disabled={isFirst}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-1">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'bg-blue-500 w-6'
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {isLast ? 'Get Started!' : 'Next'}
              {!isLast && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>

          {/* Skip Link */}
          {!isLast && (
            <div className="mt-4 text-center">
              <button
                onClick={handleSkip}
                className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
              >
                Skip tour
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
