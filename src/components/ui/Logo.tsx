'use client'

import { motion } from 'framer-motion'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
}

export function Logo({ size = 'md', animated = true, className = '' }: LogoProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  }

  const KLogo = () => (
    <div className={`${sizes[size]} relative ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="kGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="kGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="glowStrong">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Outer glow circle */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="url(#kGradient)"
          opacity="0.15"
          className="animate-pulse-slow"
        />
        
        {/* Background circle with gradient */}
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="url(#kGradient)"
          opacity="0.25"
          className="animate-pulse-slow"
        />
        
        {/* Main K shape - bold */}
        <path
          d="M 28 20 L 28 80 M 28 50 L 58 25 M 28 50 L 58 75"
          stroke="url(#kGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glowStrong)"
          className="transition-all-smooth"
        />
        
        {/* Accent K shape - thinner overlay */}
        <path
          d="M 28 20 L 28 80 M 28 50 L 58 25 M 28 50 L 58 75"
          stroke="url(#kGradient2)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
          className="transition-all-smooth"
        />
        
        {/* Decorative dots */}
        <circle cx="65" cy="35" r="3" fill="url(#kGradient)" opacity="0.6" />
        <circle cx="65" cy="65" r="3" fill="url(#kGradient)" opacity="0.6" />
      </svg>
      {/* Animated glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 blur-2xl -z-10 animate-pulse-slow" />
    </div>
  )

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15
        }}
        whileHover={{ scale: 1.15, rotate: 8 }}
        whileTap={{ scale: 0.9 }}
        className="relative cursor-pointer"
      >
        <KLogo />
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              '0 0 20px rgba(59, 130, 246, 0.3)',
              '0 0 30px rgba(139, 92, 246, 0.4)',
              '0 0 20px rgba(59, 130, 246, 0.3)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    )
  }

  return <KLogo />
}

