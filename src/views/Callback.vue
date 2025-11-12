<template>
  <div class="text-center mt-5">
    <h3>Procesando autenticación...</h3>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import router from '../router'
import { useAuthStore } from '../stores/auth'

const { handleRedirectCallback } = useAuth0() as any
const authStore = useAuthStore()

onMounted(async () => {
  try {
    const result = await handleRedirectCallback()
    await authStore.fetchAndSetToken()
    const target = result?.appState?.target || '/dashboard'
    router.replace(target)
  } catch (err) {
    authStore.clearAuth()
    router.replace('/')
  }
})
</script>
