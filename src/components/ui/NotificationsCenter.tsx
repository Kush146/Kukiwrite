'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { Button } from './Button'
import { Bell, X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react'
import { useToast } from './Toast'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

export function NotificationsCenter() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { showToast } = useToast()

  useEffect(() => {
    // Load notifications from localStorage
    const stored = localStorage.getItem('kukiwrite_notifications')
    if (stored) {
      setNotifications(JSON.parse(stored).map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp)
      })))
    }

    // Check for usage alerts
    checkUsageAlerts()
  }, [])

  const checkUsageAlerts = async () => {
    try {
      const response = await fetch('/api/user/usage')
      if (response.ok) {
        const data = await response.json()
        const usagePercent = (data.usage / data.limit) * 100

        if (usagePercent >= 90) {
          addNotification({
            type: 'warning',
            title: 'Usage Limit Warning',
            message: `You've used ${data.usage} of ${data.limit} generations (${Math.round(usagePercent)}%). Consider upgrading to Pro for unlimited access.`
          })
        } else if (usagePercent >= 75) {
          addNotification({
            type: 'info',
            title: 'Usage Update',
            message: `You've used ${data.usage} of ${data.limit} generations this month.`
          })
        }
      }
    } catch (error) {
      console.error('Failed to check usage:', error)
    }
  }

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }
    const updated = [newNotification, ...notifications].slice(0, 50) // Keep last 50
    setNotifications(updated)
    localStorage.setItem('kukiwrite_notifications', JSON.stringify(updated))
  }

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n)
    setNotifications(updated)
    localStorage.setItem('kukiwrite_notifications', JSON.stringify(updated))
  }

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id)
    setNotifications(updated)
    localStorage.setItem('kukiwrite_notifications', JSON.stringify(updated))
  }

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }))
    setNotifications(updated)
    localStorage.setItem('kukiwrite_notifications', JSON.stringify(updated))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-400" />
      default:
        return <Info className="w-5 h-5 text-blue-400" />
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <Card className="absolute right-0 top-full mt-2 w-96 max-h-[500px] overflow-y-auto z-50 animate-scale-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </CardTitle>
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                      Mark all read
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Bell className="w-12 h-12 mx-auto mb-2 text-slate-600" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${
                        notification.read
                          ? 'bg-slate-900/30 border-slate-800'
                          : 'bg-blue-500/10 border-blue-500/30'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        {getIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-slate-200">{notification.title}</p>
                          <p className="text-xs text-slate-400 mt-1">{notification.message}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {notification.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </>
  )
}



