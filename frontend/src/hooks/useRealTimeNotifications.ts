import { useState, useEffect, useCallback } from 'react'
import { useWebSocket } from './useWebSocket'

interface Notification {
  id: string
  type: 'info' | 'warning' | 'success' | 'error'
  title: string
  message: string
  timestamp: string
  read: boolean
  persistent?: boolean
}

interface RealTimeNotificationOptions {
  maxNotifications?: number
  autoRemoveDelay?: number
  onNotification?: (notification: Notification) => void
}

export const useRealTimeNotifications = (options: RealTimeNotificationOptions = {}) => {
  const {
    maxNotifications = 10,
    autoRemoveDelay = 5000,
    onNotification
  } = options

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // WebSocket connection for real-time updates (optional)
  const { isConnected, sendMessage } = useWebSocket({
    // Only connect if WebSocket URL is provided in environment
    url: import.meta.env.VITE_WEBSOCKET_URL,
    onMessage: (message) => {
      if (message.type === 'notification') {
        addNotification(message.data)
      }
    }
  })

  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const notification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    }

    setNotifications(prev => {
      const newNotifications = [notification, ...prev].slice(0, maxNotifications)
      return newNotifications
    })

    setUnreadCount(prev => prev + 1)
    onNotification?.(notification)

    // Auto-remove non-persistent notifications
    if (!notification.persistent) {
      setTimeout(() => {
        removeNotification(notification.id)
      }, autoRemoveDelay)
    }
  }, [maxNotifications, autoRemoveDelay, onNotification])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id)
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1))
      }
      return prev.filter(n => n.id !== id)
    })
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
    setUnreadCount(0)
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
    setUnreadCount(0)
  }, [])

  // Simulate real-time notifications for demo
  useEffect(() => {
    if (!isConnected) return

    const interval = setInterval(() => {
      const notificationTypes = [
        {
          type: 'warning' as const,
          title: 'High Water Level Alert',
          message: 'Water level in Alappuzha district has reached 2.3m - above normal threshold'
        },
        {
          type: 'info' as const,
          title: 'New Flood Report',
          message: 'User reported flooding in Ernakulam district. Status: Pending verification'
        },
        {
          type: 'success' as const,
          title: 'Alert Sent Successfully',
          message: 'Flood warning sent to 1,247 subscribers in Kerala'
        },
        {
          type: 'error' as const,
          title: 'System Error',
          message: 'AI prediction model encountered an error. Retrying...'
        }
      ]

      const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)]
      
      // Only add notification occasionally (10% chance every 30 seconds)
      if (Math.random() < 0.1) {
        addNotification(randomNotification)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [isConnected, addNotification])

  // Request permission for browser notifications
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Show browser notification when new notification arrives
  useEffect(() => {
    if (notifications.length > 0 && 'Notification' in window && Notification.permission === 'granted') {
      const latestNotification = notifications[0]
      if (!latestNotification.read) {
        new Notification(latestNotification.title, {
          body: latestNotification.message,
          icon: '/favicon.ico',
          tag: latestNotification.id
        })
      }
    }
  }, [notifications])

  return {
    notifications,
    unreadCount,
    isConnected,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    sendMessage
  }
}
