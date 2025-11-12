import { defineStore } from 'pinia'
import { ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  message: string
  duration?: number
}

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])

  const addNotification = (
    type: NotificationType,
    message: string,
    duration: number = 5000
  ) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const notification: Notification = {
      id,
      type,
      message,
      duration,
    }

    notifications.value.push(notification)

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const success = (message: string, duration?: number) => {
    return addNotification('success', message, duration)
  }

  const error = (message: string, duration?: number) => {
    return addNotification('error', message, duration)
  }

  const warning = (message: string, duration?: number) => {
    return addNotification('warning', message, duration)
  }

  const info = (message: string, duration?: number) => {
    return addNotification('info', message, duration)
  }

  const clearAll = () => {
    notifications.value = []
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
    clearAll,
  }
})

