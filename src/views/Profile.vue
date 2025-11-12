<template>
  <div class="profile-view">
    <h1 class="mb-4">Perfil de usuario</h1>

    <div v-if="authStore.loading" class="text-center my-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="authStore.isAuth">
      <!-- Sección de confirmación de número celular -->
      <div v-if="showMobileConfirm" class="card p-4 shadow-sm mb-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3 class="card-title mb-0">Confirmar Número Celular</h3>
          <button 
            @click="showMobileConfirm = false" 
            class="btn btn-sm btn-outline-secondary"
            type="button"
          >
            Ocultar
          </button>
        </div>
        <div class="alert alert-info mb-3">
          <strong>ℹ️</strong> Si aún no has confirmado tu número de celular, ingresa el código que recibiste por SMS.
        </div>
        <ConfirmMobileForm 
          @confirmed="handleMobileConfirmed"
          @error="handleConfirmError"
        />
      </div>

      <!-- Datos del usuario -->
      <div class="card p-4 shadow-sm">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3 class="card-title mb-0">Datos del usuario</h3>
          <button 
            v-if="!showMobileConfirm"
            @click="showMobileConfirm = true" 
            class="btn btn-sm btn-outline-primary"
            type="button"
          >
            Confirmar número celular
          </button>
        </div>
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
    </div>

    <div v-else class="alert alert-warning">
      No estás autenticado. Por favor, inicia sesión para ver tu perfil.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useNotificationsStore } from '../stores/notifications'
import ConfirmMobileForm from '../components/auth/ConfirmMobileForm.vue'

const authStore = useAuthStore()
const notifications = useNotificationsStore()
const showMobileConfirm = ref(false)

const handleMobileConfirmed = () => {
  showMobileConfirm.value = false
  notifications.success('Tu número de celular ha sido confirmado exitosamente.')
}

const handleConfirmError = (errorMessage: string) => {
  // Los errores ya se manejan en el componente
  if (import.meta.env.DEV) {
    console.error('Error al confirmar:', errorMessage)
  }
}
</script>

<style scoped>
.profile-view {
  max-width: 800px;
  margin: 0 auto;
}
</style>

