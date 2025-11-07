<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

const authStore = useAuthStore()
const apiResponse = ref<string>('Haz clic en el botón para llamar a la API protegida.')
const apiError = ref<string | null>(null)

const callProtectedApi = async () => {
  apiResponse.value = 'Llamando a la API protegida...'
  apiError.value = null
  try {
    const response = await api.get('/parameters/api/v1/parameters')
    apiResponse.value = JSON.stringify(response.data, null, 2)
  } catch (error: any) {
    console.error('Error al llamar a la API protegida:', error)
    apiError.value = `Error: ${error.message}`
  }
}
</script>

<template>
  <div class="dashboard-view">
    <h1 class="mb-4">Dashboard</h1>

    <div v-if="authStore.loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando usuario...</span>
      </div>
      <p class="mt-2">Cargando información del usuario...</p>
    </div>

    <div v-else-if="authStore.isAuth" class="card shadow-sm p-4">
      <h3 class="card-title mb-3">Información del Usuario</h3>
      <ul class="list-group list-group-flush mb-4">
        <li class="list-group-item"><strong>Nombre:</strong> {{ authStore.currentUser?.name }}</li>
        <li class="list-group-item"><strong>Email:</strong> {{ authStore.currentUser?.email }}</li>
        <li class="list-group-item"><strong>Roles:</strong> {{ authStore.userRoles.join(', ') }}</li>
      </ul>

      <button @click="callProtectedApi" class="btn btn-success mb-3">
        Llamar a API Protegida
      </button>

      <div class="card mt-3">
        <div class="card-header">Respuesta de la API:</div>
        <div class="card-body bg-light">
          <pre class="mb-0">{{ apiResponse }}</pre>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-warning mt-4">
      No estás autenticado. Por favor, <router-link to="/login" class="alert-link">inicia sesión</router-link>.
    </div>
  </div>
</template>
