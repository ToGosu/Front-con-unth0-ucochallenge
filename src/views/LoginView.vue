<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'

const { loginWithRedirect, isAuthenticated, user } = useAuth0()

const handleLogin = async () => {
  try {
    await loginWithRedirect({
      appState: { target: '/dashboard' }
    })
  } catch (error) {
    console.error('Error al iniciar sesión con Auth0:', error)
  }
}
</script>

<template>
  <div class="login-container text-center mt-5">
    <div v-if="!isAuthenticated">
      <h2 class="mb-4">Bienvenido a UcoChallenge</h2>
      <button class="btn btn-primary btn-lg" @click="handleLogin">
        Iniciar sesión con Auth0
      </button>
    </div>

    <div v-else>
      <p>Sesión iniciada como:</p>
      <p class="fw-bold">{{ user?.name || user?.email }}</p>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
}
</style>
