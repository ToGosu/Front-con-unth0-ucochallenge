<template>
  <div class="profile-view">
    <h1 class="mb-4">Perfil de usuario</h1>

    <div v-if="isLoading" class="text-center my-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="isAuthenticated" class="card p-4 shadow-sm">
      <h3 class="card-title mb-3">Datos del usuario</h3>
      <ul class="list-group list-group-flush">
        <li class="list-group-item"><strong>Nombre:</strong> {{ user?.name }}</li>
        <li class="list-group-item"><strong>Email:</strong> {{ user?.email }}</li>
        <li class="list-group-item"><strong>Sub:</strong> {{ user?.sub }}</li>
        <li class="list-group-item"><strong>Roles (if any):</strong> {{ user?.['https://example.com/roles'] || 'N/A' }}</li>
      </ul>
    </div>

    <div v-else class="alert alert-warning">
      No estás autenticado. Por favor, inicia sesión para ver tu perfil.
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth'

const { isAuthenticated, user, isLoading } = useAuth()
</script>

<style scoped>
.profile-view {
  max-width: 800px;
  margin: 0 auto;
}
</style>

