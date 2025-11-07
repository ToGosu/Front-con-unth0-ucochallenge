<template>
  <div class="container mt-5">
    <div class="card shadow-sm p-4">
      <h2 class="mb-4 text-center">Registros de Usuarios Existentes</h2>

      <button @click="fetchUsers" class="btn btn-success mb-3" :disabled="loading">
        {{ loading ? 'Cargando...' : 'Recargar Lista' }}
      </button>

      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-if="loading && users.length === 0" class="text-center text-info">Cargando datos...</div>

      <div v-if="users.length > 0">
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Completo</th>
              <th>Email</th>
              <th>Ciudad (UUID)</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="user in users" :key="user.idNumber">
              <td>{{ user.idNumber }}</td>
              <td>{{ user.firstName }} {{ user.firstSurname }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.homeCity }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else-if="!loading" class="alert alert-warning text-center">
        No hay registros de usuarios para mostrar.
      </div>
    </div>
    <div class="mt-3">
      <router-link :to="{ name: 'home' }" class="btn btn-link">Volver al Home</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../services/api';

interface UserRecord {
  idNumber: string;
  firstName: string;
  firstSurname: string;
  email: string;
  homeCity: string;
  // ... otros campos
}

const users = ref<UserRecord[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const fetchUsers = async () => {
  loading.value = true;
  error.value = null;

  try {
    // ✅ Endpoint correcto (GET /api/v1/users)
    const response = await api.get('/api/v1/users');

    // Asumiendo que la respuesta es un array de objetos UserRecord
    users.value = response.data || [];

  } catch (err: any) {
    error.value =
      err.response?.data?.message ||
      'Fallo al cargar los usuarios. Asegúrate de tener el rol "admin" y que el Gateway esté activo.';
    users.value = [];
  } finally {
    loading.value = false;
  }
};

// Cargar usuarios al montar la vista
onMounted(fetchUsers);
</script>