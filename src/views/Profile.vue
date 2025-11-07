<template>
  <div class="profile-view">
    <h1 class="mb-4">Perfil de usuario</h1>

    <div v-if="authStore.loading" class="text-center my-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="authStore.isAuth" class="card p-4 shadow-sm">
      <h3 class="card-title mb-3">Datos del usuario</h3>
      <ul class="list-group list-group-flush">
        <li class="list-group-item"><strong>Nombre:</strong> {{ authStore.currentUser?.name || 'N/A' }}</li>
        <li class="list-group-item"><strong>Email:</strong> {{ authStore.currentUser?.email || 'N/A' }}</li>
        <li class="list-group-item"><strong>Nickname:</strong> {{ authStore.currentUser?.nickname || 'N/A' }}</li>
        <li class="list-group-item"><strong>Sub:</strong> {{ authStore.currentUser?.sub || 'N/A' }}</li>
        <li class="list-group-item">
          <strong>Roles:</strong>
          <span v-for="role in authStore.userRoles" :key="role" class="badge bg-primary me-1 ms-2">
            {{ role }}
          </span>
          <span v-if="authStore.userRoles.length === 0" class="text-muted ms-2">N/A</span>
        </li>
      </ul>
    </div>

    <div v-else class="alert alert-warning">
      No estás autenticado. Por favor, inicia sesión para ver tu perfil.
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.profile-view {
  max-width: 800px;
  margin: 0 auto;
}
</style>

