<template>
  <div class="card p-4 shadow-sm">
    <h3 class="card-title text-center mb-4">Iniciar Sesión</h3>
    <p class="text-center">Por favor, inicia sesión para acceder a tu cuenta.</p>

    <div v-if="authStore.loading" class="text-center text-info mb-3">
      Cargando estado de autenticación...
    </div>

    <button
      v-if="!authStore.isAuth"
      @click="handleLogin"
      class="btn btn-primary btn-lg w-100"
    >
      Iniciar Sesión con Auth0
    </button>

    <button
      v-if="authStore.isAuth"
      @click="handleLogout"
      class="btn btn-secondary btn-lg w-100 mt-2"
    >
      Cerrar Sesión
    </button>

    <div v-if="authStore.isAuth" class="mt-3 alert alert-success">
      <p>¡Autenticado!</p>
      <strong>Roles Asignados:</strong>
      <span
        v-for="role in authStore.userRoles"
        :key="role"
        class="badge bg-primary me-1"
      >
        {{ role }}
      </span>
    </div>

    <p v-if="error" class="text-danger text-center mt-2">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useAuthStore } from '../../stores/auth'

const { loginWithRedirect, logout, error: auth0Error } = useAuth0()
const authStore = useAuthStore()
const error = ref<string | null>(null)

const handleLogin = async () => {
  error.value = null
  try {
    await loginWithRedirect({
      appState: { target: '/dashboard' }
    })
  } catch (err: any) {
    if (import.meta.env.DEV) {
      console.error('Error al iniciar sesión:', err)
    }
    error.value = auth0Error.value?.message || 'Error al iniciar sesión'
  }
}

const handleLogout = () => {
  logout({ logoutParams: { returnTo: window.location.origin } })
}
</script>

<style scoped>
.card {
  max-width: 400px;
  margin: 2rem auto;
}
</style>
