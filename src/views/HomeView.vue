<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow-lg p-5">
          <h1 class="text-center text-primary mb-4">
            {{ authStore.isAuth ? '¡Bienvenido al Sistema!' : 'Inicie Sesión' }}
          </h1>

          <div v-if="authStore.loading" class="text-center">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Cargando estado de autenticación...</p>
          </div>

          <div v-else-if="!authStore.isAuth" class="text-center">
            <p class="lead">Por favor, inicia sesión para acceder a las funcionalidades.</p>
            <button @click="authStore.auth0Login()" class="btn btn-primary btn-lg mt-3">
              Iniciar Sesión
            </button>
          </div>

          <div v-else>
            <h3 class="mb-3">Hola, {{ authStore.currentUser?.nickname || 'Usuario' }}</h3>

            <div v-if="authStore.hasRole('admin')" class="alert alert-success mt-4">
              <p class="lead">🎉 ¡Tienes el rol **ADMINISTRADOR**! Puedes gestionar usuarios.</p>
              <hr />
              <div class="d-grid gap-2">
                <router-link :to="{ name: 'admin.register' }" class="btn btn-danger btn-lg">
                  <i class="bi bi-person-plus-fill"></i> Registrar Nuevo Usuario
                </router-link>
                <router-link :to="{ name: 'admin.list' }" class="btn btn-secondary btn-lg">
                  <i class="bi bi-list-columns"></i> Ver Registros Existentes
                </router-link>
              </div>
            </div>

            <div v-else-if="authStore.hasRole('client')" class="alert alert-info mt-4">
              <p class="lead">
                ¡Tienes el rol **CLIENT**! <br />
                ❌ No tienes permisos para acceder a las secciones de administración.
              </p>
              <p class="mt-3">
                <button @click="authStore.clearAuth()" class="btn btn-sm btn-outline-secondary">
                  Cerrar Sesión
                </button>
              </p>
            </div>

            <p class="mt-4 text-muted small">
              Roles actuales:
              <span v-for="role in authStore.userRoles" :key="role" class="badge bg-secondary me-1">{{ role }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useAuth0 } from '@auth0/auth0-vue'; // Para manejar el isLoading

const authStore = useAuthStore();
const { isLoading } = useAuth0();

// 💡 CLAVE: Observar la carga para obtener el token tan pronto como el SDK esté listo
watch(isLoading, async (newVal) => {
  if (newVal === false && authStore.isAuth && !authStore.accessToken) {
    await authStore.fetchAndSetToken();
  }
}, { immediate: true });

onMounted(() => {
  // Si ya estamos autenticados y no tenemos token (ej: después de una recarga), intentar obtenerlo
  if (authStore.isAuth && !authStore.accessToken) {
    authStore.fetchAndSetToken();
  }
});
</script>

<style scoped>
/* Estilos Bootstrap mejorados */
.card {
  border-radius: 10px;
}
</style>