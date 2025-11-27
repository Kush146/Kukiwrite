'use client'

import { useState } from 'react'
import { Button } from './Button'
import { Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Save } from 'lucide-react'

interface ContentEditorProps {
  content: string
  onSave?: (content: string) => void
  editable?: boolean
}

export function ContentEditor({ content, onSave, editable = true }: ContentEditorProps) {
  const [editedContent, setEditedContent] = useState(content)

  const handleFormat = (command: string) => {
    document.execCommand(command, false)
  }

  const handleSave = () => {
    if (onSave) {
      onSave(editedContent)
    }
  }

  if (!editable) {
    return (
      <div className="prose prose-invert max-w-none">
        <pre className="whitespace-pre-wrap text-sm bg-slate-900/50 p-4 rounded-lg">
          {content}
        </pre>
      </div>
    )
  }

  return (
    <div className="border border-slate-800 rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 p-2 border-b border-slate-800 bg-slate-900/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('bold')}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('italic')}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('underline')}
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-slate-700 mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('insertUnorderedList')}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('insertOrderedList')}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('createLink')}
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </Button>
        <div className="flex-1" />
        {onSave && (
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        )}
      </div>
      <div
        contentEditable
        className="min-h-[300px] p-4 bg-slate-900/30 text-slate-200 focus:outline-none prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: editedContent }}
        onInput={(e) => setEditedContent(e.currentTarget.innerHTML)}
        suppressContentEditableWarning
      />
    </div>
  )
}



