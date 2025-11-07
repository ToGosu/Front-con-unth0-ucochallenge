<script setup lang="ts">
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const handleLogout = () => {
  authStore.clearAuth()
}
</script>

<template>
  <button @click="handleLogout" class="btn btn-danger">
    Cerrar Sesión
  </button>
</template>
