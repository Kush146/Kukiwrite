'use client'

import { useState } from 'react'
import { Button } from './Button'
import { Download, FileText, FileCode, File, FileType } from 'lucide-react'
import { exportToPDF, exportToMarkdown, exportToHTML, exportToDOCX } from '@/lib/export'
import { useToast } from './Toast'

interface ExportMenuProps {
  content: string
  filename: string
}

export function ExportMenu({ content, filename }: ExportMenuProps) {
  const [open, setOpen] = useState(false)
  const { showToast } = useToast()

  const handleExport = (format: string, exportFn: () => void) => {
    try {
      exportFn()
      showToast(`Exported as ${format}`, 'success')
      setOpen(false)
    } catch (error) {
      showToast('Export failed', 'error')
    }
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
      >
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-xl z-50 animate-scale-in">
            <div className="p-2">
              <button
                onClick={() => handleExport('TXT', () => {
                  const blob = new Blob([content], { type: 'text/plain' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `${filename}.txt`
                  a.click()
                  URL.revokeObjectURL(url)
                })}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors text-left"
              >
                <FileText className="w-4 h-4 text-blue-400" />
                <span className="text-sm">Text (.txt)</span>
              </button>
              <button
                onClick={() => handleExport('Markdown', () => exportToMarkdown(content, filename))}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors text-left"
              >
                <FileCode className="w-4 h-4 text-green-400" />
                <span className="text-sm">Markdown (.md)</span>
              </button>
              <button
                onClick={() => handleExport('HTML', () => exportToHTML(content, filename))}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors text-left"
              >
                <FileCode className="w-4 h-4 text-orange-400" />
                <span className="text-sm">HTML (.html)</span>
              </button>
              <button
                onClick={() => handleExport('DOCX', () => exportToDOCX(content, filename))}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors text-left"
              >
                <File className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Word (.doc)</span>
              </button>
              <button
                onClick={() => handleExport('PDF', () => exportToPDF(content, filename))}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors text-left"
              >
                <FileType className="w-4 h-4 text-red-400" />
                <span className="text-sm">PDF (.pdf)</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}



