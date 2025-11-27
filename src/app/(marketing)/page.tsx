import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Footer } from '@/components/layout/Footer'
import { Logo } from '@/components/ui/Logo'
import { FileText, Video, Search, RefreshCw } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100 transition-colors">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 text-slate-100">
            <Link href="/" className="flex items-center space-x-3 group">
              <Logo size="md" animated={true} />
              <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all-smooth">
                Kukiwrite
              </span>
            </Link>
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-fade-in">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-fade-in">
            AI Content Automation for Creators & Teams
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Generate blog posts, YouTube scripts, SEO content, and rewrite text with AI.
            Save hours of work and focus on what matters.
          </p>
          <div className="flex justify-center space-x-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Link href="/register">
              <Button size="lg">Get Started Free</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-white animate-fade-in">Powerful AI Tools</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 border border-slate-800 rounded-xl bg-slate-900/60 hover-lift hover-glow animate-fade-in group">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all-smooth">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">Blog Posts</h3>
            <p className="text-slate-300">
              Generate comprehensive, well-structured blog posts on any topic.
            </p>
          </div>
          <div className="p-6 border border-slate-800 rounded-xl bg-slate-900/60 hover-lift hover-glow animate-fade-in group" style={{ animationDelay: '0.1s' }}>
            <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-red-500/20 transition-all-smooth">
              <Video className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-red-400 transition-colors">YouTube Scripts</h3>
            <p className="text-slate-300">
              Create engaging video scripts with hooks, transitions, and CTAs.
            </p>
          </div>
          <div className="p-6 border border-slate-800 rounded-xl bg-slate-900/60 hover-lift hover-glow animate-fade-in group" style={{ animationDelay: '0.2s' }}>
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-green-500/20 transition-all-smooth">
              <Search className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-green-400 transition-colors">SEO Content</h3>
            <p className="text-slate-300">
              Optimize your content for search engines with keyword strategies.
            </p>
          </div>
          <div className="p-6 border border-slate-800 rounded-xl bg-slate-900/60 hover-lift hover-glow animate-fade-in group" style={{ animationDelay: '0.3s' }}>
            <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all-smooth">
              <RefreshCw className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-orange-400 transition-colors">Content Rewriter</h3>
            <p className="text-slate-300">
              Rewrite and improve existing content with different tones and styles.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-900/60 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg shadow-blue-600/40">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
              <p className="text-slate-300">
                Create your free account in seconds. No credit card required.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Tool</h3>
              <p className="text-slate-300">
                Select from blog posts, YouTube scripts, SEO content, or rewriter.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Generate Content</h3>
              <p className="text-slate-300">
                Enter your requirements and let AI create high-quality content instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Simple Pricing</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="p-8 border border-slate-800 rounded-xl bg-slate-900/70">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <p className="text-4xl font-bold mb-4">$0<span className="text-lg text-slate-300">/month</span></p>
            <ul className="space-y-2 mb-6 text-slate-300">
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                50 generations per month
              </li>
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                All AI tools included
              </li>
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                Basic support
              </li>
            </ul>
            <Link href="/register">
              <Button className="w-full">Get Started</Button>
            </Link>
          </div>
          <div className="p-8 border-2 border-blue-500/70 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20">
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-4xl font-bold mb-4">$29<span className="text-lg text-slate-300">/month</span></p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <span className="text-green-300 mr-2">✓</span>
                Unlimited generations
              </li>
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                All AI tools included
              </li>
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                Priority support
              </li>
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                Advanced features
              </li>
            </ul>
            <Link href="/register">
              <Button className="w-full">Upgrade to Pro</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

