import Link from 'next/link'
import { Footer } from '@/components/layout/Footer'
import { ArrowLeft, Mail } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl text-center space-y-6">
          <h1 className="text-4xl font-bold text-white mb-4">About Kush Kore & Kukiwrite</h1>
          <p className="text-lg text-slate-300">
            Hello! I'm Kush Kore, a passionate fullstack developer dedicated to crafting clean, efficient, and user-friendly applications. I believe in building products with strong engineering foundations and a smooth user experience.
          </p>
          <p className="text-lg text-slate-300">
            Kukiwrite is a project born from this passion, designed to be a modern AI content automation platform for creators and teams. My goal was to create an intuitive workspace where AI tools empower users to generate high-quality content effortlessly, saving time and boosting creativity.
          </p>
          <p className="text-lg text-slate-300">
            I'm constantly exploring new technologies and striving to build impactful solutions. Thank you for checking out Kukiwrite!
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <Mail className="w-5 h-5 text-blue-400" />
            <a 
              href="mailto:kushkore.work@gmail.com" 
              className="text-blue-400 hover:text-blue-300 hover:underline text-lg"
            >
              kushkore.work@gmail.com
            </a>
          </div>
          <Link href="/" className="inline-flex items-center text-blue-400 hover:underline mt-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}



