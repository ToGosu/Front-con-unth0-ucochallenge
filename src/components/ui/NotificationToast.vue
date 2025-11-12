<template>
  <TransitionGroup
    name="notification"
    tag="div"
    class="notification-container"
  >
    <div
      v-for="notification in notifications"
      :key="notification.id"
      :class="getNotificationClass(notification.type)"
      class="notification-toast alert alert-dismissible fade show"
      role="alert"
    >
      <strong>{{ getNotificationTitle(notification.type) }}</strong>
      {{ notification.message }}
      <button
        type="button"
        class="btn-close"
        @click="removeNotification(notification.id)"
        aria-label="Cerrar"
      ></button>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNotificationsStore, type NotificationType } from '../../stores/notifications'

const notificationsStore = useNotificationsStore()

const notifications = computed(() => notificationsStore.notifications)

const getNotificationClass = (type: NotificationType): string => {
  const classMap: Record<NotificationType, string> = {
    success: 'alert-success',
    error: 'alert-danger',
    warning: 'alert-warning',
    info: 'alert-info',
  }
  return classMap[type] || 'alert-info'
}

const getNotificationTitle = (type: NotificationType): string => {
  const titleMap: Record<NotificationType, string> = {
    success: '',
    error: '',
    warning: '',
    info: '',
  }
  return titleMap[type] || ''
}

const removeNotification = (id: string) => {
  notificationsStore.removeNotification(id)
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
  pointer-events: none;
}

.notification-toast {
  pointer-events: auto;
  margin-bottom: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 300px;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>

