'use client'

import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import { Github, Linkedin, Mail, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

export function Footer() {
  return (
    <footer className="relative border-t border-slate-800/50 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12 mt-auto overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-gradient"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <Logo size="md" animated={true} />
              <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Kukiwrite
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-xs">
              AI-powered content automation platform for creators and teams. Generate, optimize, and scale your content effortlessly.
            </p>
          </motion.div>

          {/* Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-slate-200 mb-4">Quick Links</h3>
            <div className="flex flex-col gap-3">
              <Link
                href="/about"
                className="text-slate-400 hover:text-blue-400 transition-all-smooth hover:translate-x-1 inline-flex items-center gap-2 group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                About us
              </Link>
              <a
                href="https://www.linkedin.com/in/kushkore"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-400 transition-all-smooth hover:translate-x-1 inline-flex items-center gap-2 group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Contact us
              </a>
              <Link
                href="/dashboard"
                className="text-slate-400 hover:text-blue-400 transition-all-smooth hover:translate-x-1 inline-flex items-center gap-2 group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Dashboard
              </Link>
            </div>
          </motion.div>

          {/* Social & Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-slate-200 mb-4">Connect</h3>
            <div className="flex flex-col gap-3">
              <a
                href="https://www.linkedin.com/in/kushkore"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-400 transition-all-smooth inline-flex items-center gap-2 group"
              >
                <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                LinkedIn
              </a>
              <a
                href="mailto:kushkore.work@gmail.com"
                className="text-slate-400 hover:text-blue-400 transition-all-smooth inline-flex items-center gap-2 group"
              >
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                kushkore.work@gmail.com
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-slate-400 text-center md:text-left"
            >
              &copy; {new Date().getFullYear()} Kukiwrite. All rights reserved.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-2 text-slate-400"
            >
              <span>Made with</span>
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500 animate-pulse-slow" />
              <span>by</span>
              <span className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Kush Kore
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}

