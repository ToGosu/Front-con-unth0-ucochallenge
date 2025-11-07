<!-- AdminView.vue -->
<template>
  <div class="container mt-5">
    <div class="card shadow-lg p-4 bg-light">
      <h1 class="card-title text-center text-danger mb-4">
        🛡️ Panel de Administración (ACCESO RESTRINGIDO)
      </h1>
      <p class="lead text-center">
        ¡Bienvenido, {{ authStore.currentUser?.nickname || 'Administrador' }}!
      </p>

      <div class="alert alert-warning text-center">
        Esta vista solo es accesible si el usuario tiene el rol:
        <span class="badge bg-danger fs-6">admin</span>.
      </div>

      <div class="mt-4">
        <h5>Detalles de Autorización:</h5>
        <ul class="list-group">
          <li class="list-group-item">
            <strong>Autenticado:</strong>
            <span :class="{'text-success': authStore.isAuth, 'text-danger': !authStore.isAuth}">
              {{ authStore.isAuth ? 'Sí' : 'No' }}
            </span>
          </li>
          <li class="list-group-item">
            <strong>Roles Asignados:</strong>
            <span v-if="authStore.userRoles.length > 0">
              <span v-for="role in authStore.userRoles" :key="role" class="badge bg-primary me-1">{{ role }}</span>
            </span>
            <span v-else class="text-muted">Ninguno (Debería tener 'client' si la Action funciona)</span>
          </li>
          <li class="list-group-item">
            <strong>Acceso a Dashboard:</strong>
            <span :class="{'text-success': authStore.hasRole('admin'), 'text-danger': !authStore.hasRole('admin')}">
              {{ authStore.hasRole('admin') ? 'Permitido (Rol "admin" encontrado)' : 'Denegado' }}
            </span>
          </li>
        </ul>
      </div>

      <p class="text-muted small mt-3">
        El rol fue verificado por el Vue Router Navigation Guard usando el claim del ID Token.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
const authStore = useAuthStore()
</script>

<style scoped>
.card {
  max-width: 600px;
  margin: 0 auto;
}
</style>
