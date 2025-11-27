'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/components/ui/Toast'
import { Calendar, Plus, Clock, FileText, Video, Instagram, Search, RefreshCw, Trash2 } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'

interface ScheduledContent {
  id: string
  title: string
  type: 'BLOG' | 'YOUTUBE' | 'SEO' | 'INSTAGRAM' | 'REWRITER'
  scheduledFor: Date
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
}

const typeIcons = {
  BLOG: FileText,
  YOUTUBE: Video,
  SEO: Search,
  INSTAGRAM: Instagram,
  REWRITER: RefreshCw
}

const typeLabels = {
  BLOG: 'Blog Post',
  YOUTUBE: 'YouTube Script',
  SEO: 'SEO Content',
  INSTAGRAM: 'Instagram Content',
  REWRITER: 'Content Rewriter'
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [scheduledItems, setScheduledItems] = useState<ScheduledContent[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    type: 'BLOG' as ScheduledContent['type'],
    scheduledFor: '',
    notes: ''
  })
  const { showToast } = useToast()

  useEffect(() => {
    loadScheduledItems()
  }, [])

  const loadScheduledItems = () => {
    const stored = localStorage.getItem('kukiwrite_scheduled_content')
    if (stored) {
      setScheduledItems(JSON.parse(stored).map((item: any) => ({
        ...item,
        scheduledFor: new Date(item.scheduledFor)
      })))
    }
  }

  const saveScheduledItems = (items: ScheduledContent[]) => {
    localStorage.setItem('kukiwrite_scheduled_content', JSON.stringify(items))
    setScheduledItems(items)
  }

  const handleAddSchedule = () => {
    if (!formData.title || !formData.scheduledFor) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    const newItem: ScheduledContent = {
      id: Date.now().toString(),
      title: formData.title,
      type: formData.type,
      scheduledFor: new Date(formData.scheduledFor),
      status: 'scheduled',
      notes: formData.notes
    }

    const updated = [...scheduledItems, newItem]
    saveScheduledItems(updated)
    setShowAddModal(false)
    setFormData({ title: '', type: 'BLOG', scheduledFor: '', notes: '' })
    showToast('Content scheduled successfully!', 'success')
  }

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this scheduled item?')) return
    const updated = scheduledItems.filter(item => item.id !== id)
    saveScheduledItems(updated)
    showToast('Scheduled item deleted', 'success')
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getScheduledForDate = (date: Date) => {
    return scheduledItems.filter(item => 
      isSameDay(item.scheduledFor, date) && item.status === 'scheduled'
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Content Calendar</h1>
          <p className="text-slate-300">Schedule and plan your content generation</p>
        </div>
        <Button onClick={() => {
          setSelectedDate(new Date())
          setFormData({ ...formData, scheduledFor: format(new Date(), 'yyyy-MM-dd') })
          setShowAddModal(true)
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Schedule Content
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {format(currentDate, 'MMMM yyyy')}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                Next
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-slate-400 py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days.map(day => {
              const dayItems = getScheduledForDate(day)
              const isToday = isSameDay(day, new Date())
              const isCurrentMonth = isSameMonth(day, currentDate)
              
              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-24 p-2 border rounded-lg ${
                    isCurrentMonth ? 'border-slate-800 bg-slate-900/30' : 'border-slate-900 bg-slate-950/30'
                  } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => {
                    setSelectedDate(day)
                    setFormData({ ...formData, scheduledFor: format(day, 'yyyy-MM-dd') })
                    setShowAddModal(true)
                  }}
                >
                  <div className={`text-sm mb-1 ${isCurrentMonth ? 'text-slate-300' : 'text-slate-600'}`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayItems.slice(0, 2).map(item => {
                      const Icon = typeIcons[item.type]
                      return (
                        <div
                          key={item.id}
                          className="text-xs p-1 bg-blue-500/20 text-blue-300 rounded truncate flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Icon className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </div>
                      )
                    })}
                    {dayItems.length > 2 && (
                      <div className="text-xs text-slate-400">
                        +{dayItems.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Scheduled Content</CardTitle>
          <CardDescription>Your scheduled content generation tasks</CardDescription>
        </CardHeader>
        <CardContent>
          {scheduledItems.filter(item => item.status === 'scheduled').length === 0 ? (
            <div className="text-center text-slate-500 py-12">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-600" />
              <p>No scheduled content yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {scheduledItems
                .filter(item => item.status === 'scheduled')
                .sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime())
                .map(item => {
                  const Icon = typeIcons[item.type]
                  return (
                    <div
                      key={item.id}
                      className="p-4 bg-slate-900/50 rounded-lg border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Icon className="w-6 h-6 text-blue-400" />
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-200">{item.title}</h4>
                          <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {format(item.scheduledFor, 'MMM d, yyyy h:mm a')}
                            </span>
                            <span>{typeLabels[item.type]}</span>
                          </div>
                          {item.notes && (
                            <p className="text-xs text-slate-500 mt-1">{item.notes}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Schedule Content</CardTitle>
              <CardDescription>Plan when to generate your content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Weekly Blog Post"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Content Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as ScheduledContent['type'] })}
                  className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
                >
                  {Object.entries(typeLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Scheduled Date & Time</label>
                <Input
                  type="datetime-local"
                  value={formData.scheduledFor}
                  onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Notes (optional)</label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Add any notes or reminders..."
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddSchedule} className="flex-1">
                  Schedule
                </Button>
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}



