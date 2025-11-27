'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { X, Menu } from 'lucide-react'
import {
  LayoutDashboard,
  FileText,
  Video,
  Search,
  RefreshCw,
  CreditCard,
  Settings,
  Instagram,
  History,
  BarChart3,
  Layers,
  GitCompare,
  Hash,
  Calendar,
  Activity,
  CheckCircle,
  Briefcase,
  Shield,
  Languages,
  Heart,
  Users,
  Gift,
  Sparkles,
  Plug,
  Mic,
  Key
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/history', label: 'History', icon: History },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/activity', label: 'Activity Feed', icon: Activity },
  { href: '/calendar', label: 'Content Calendar', icon: Calendar },
  { href: '/teams', label: 'Teams', icon: Users },
  { href: '/affiliate', label: 'Affiliate Program', icon: Gift },
  { href: '/integrations', label: 'Integrations', icon: Plug },
  { href: '/api', label: 'API Access', icon: Key },
  { href: '/brand-voices', label: 'Brand Voices', icon: Mic },
  { href: '/templates', label: 'Templates', icon: Layers },
  { href: '/tools/bulk', label: 'Bulk Generation', icon: Layers },
  { href: '/tools/blog', label: 'Blog Tool', icon: FileText },
  { href: '/tools/brief', label: 'Content Brief', icon: Briefcase },
  { href: '/tools/youtube', label: 'YouTube Tool', icon: Video },
  { href: '/tools/seo', label: 'SEO Tool', icon: Search },
  { href: '/tools/instagram', label: 'Instagram Tool', icon: Instagram },
  { href: '/tools/rewriter', label: 'Rewriter', icon: RefreshCw },
  { href: '/tools/translate', label: 'Translation', icon: Languages },
  { href: '/tools/plagiarism', label: 'Plagiarism Check', icon: Shield },
  { href: '/tools/sentiment', label: 'Sentiment Analysis', icon: Heart },
  { href: '/tools/hashtag-generator', label: 'Hashtag Generator', icon: Hash },
  { href: '/tools/seo-analyzer', label: 'SEO Analyzer', icon: Search },
  { href: '/tools/grammar-checker', label: 'Grammar Checker', icon: CheckCircle },
  { href: '/tools/compare', label: 'Content Compare', icon: GitCompare },
  { href: '/billing', label: 'Billing', icon: CreditCard },
  { href: '/settings', label: 'Settings', icon: Settings }
]

export function AppSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden fixed top-4 left-4 z-30"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </Button>
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={clsx(
          'w-64 bg-white text-slate-900 border-r border-slate-200 dark:bg-slate-950/90 dark:text-slate-200 dark:border-slate-800 backdrop-blur h-screen fixed left-0 top-0 overflow-y-auto z-20 transition-transform',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-3 group" onClick={() => setMobileOpen(false)}>
            <Logo size="md" animated={true} />
            <span className="font-bold text-xl tracking-wide bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all-smooth">
              Kukiwrite
            </span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors border border-transparent',
                  isActive
                    ? 'bg-blue-100 text-blue-600 font-semibold dark:bg-blue-600/15 dark:text-white dark:border-blue-500/30'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900/60'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
    </>
  )
}

