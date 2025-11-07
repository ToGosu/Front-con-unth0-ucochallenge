<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useNotificationsStore } from '../stores/notifications'
import api from '../services/api'
import LoadingSpinner from '../components/ui/LoadingSpinner.vue'

const authStore = useAuthStore()
const notifications = useNotificationsStore()
const apiResponse = ref<string>('Haz clic en el botón para llamar a la API protegida.')
const loading = ref(false)

const callProtectedApi = async () => {
  loading.value = true
  apiResponse.value = 'Llamando a la API protegida...'
  
  try {
    const response = await api.get('/parameters/api/v1/parameters')
    apiResponse.value = JSON.stringify(response.data, null, 2)
    notifications.success('Datos obtenidos exitosamente')
    
    if (import.meta.env.DEV) {
      console.log('Respuesta de la API:', response.data)
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Error al llamar a la API protegida'
    notifications.error(errorMessage)
    apiResponse.value = 'Error al obtener los datos.'
    
    if (import.meta.env.DEV) {
      console.error('Error al llamar a la API protegida:', error)
    }
  } finally {
    loading.value = false
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
        <li class="list-group-item"><strong>Nombre:</strong> {{ authStore.currentUser?.name || 'N/A' }}</li>
        <li class="list-group-item"><strong>Email:</strong> {{ authStore.currentUser?.email || 'N/A' }}</li>
        <li class="list-group-item">
          <strong>Roles:</strong>
          <span v-for="role in authStore.userRoles" :key="role" class="badge bg-primary me-1 ms-2">
            {{ role }}
          </span>
          <span v-if="authStore.userRoles.length === 0" class="text-muted ms-2">N/A</span>
        </li>
      </ul>

      <button @click="callProtectedApi" class="btn btn-success mb-3" :disabled="loading">
        {{ loading ? 'Llamando...' : 'Llamar a API Protegida' }}
      </button>

      <LoadingSpinner v-if="loading" message="Obteniendo datos de la API..." />

      <div v-else class="card mt-3">
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
