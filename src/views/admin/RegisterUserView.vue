<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow-sm p-4">
          <h2 class="mb-4 text-center">Registro de Nuevo Usuario</h2>
          <form @submit.prevent="submitForm">
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="idNumber" class="form-label">Número de Identificación</label>
                <input type="text" class="form-control" id="idNumber" v-model="formData.idNumber" required />
              </div>
              <div class="col-md-6">
                <label for="firstName" class="form-label">Primer Nombre</label>
                <input type="text" class="form-control" id="firstName" v-model="formData.firstName" required />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="secondName" class="form-label">Segundo Nombre</label>
                <input type="text" class="form-control" id="secondName" v-model="formData.secondName" />
              </div>
              <div class="col-md-6">
                <label for="firstSurname" class="form-label">Primer Apellido</label>
                <input type="text" class="form-control" id="firstSurname" v-model="formData.firstSurname" required />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="secondSurname" class="form-label">Segundo Apellido</label>
                <input type="text" class="form-control" id="secondSurname" v-model="formData.secondSurname" />
              </div>
              <div class="col-md-6">
                <label for="homeCity" class="form-label">UUID Ciudad (ej: texto)</label>
                <input type="text" class="form-control" id="homeCity" v-model="formData.homeCity" required />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" v-model="formData.email" required />
              </div>
              <div class="col-md-6">
                <label for="mobileNumber" class="form-label">Teléfono Móvil</label>
                <input type="tel" class="form-control" id="mobileNumber" v-model="formData.mobileNumber" required />
              </div>
            </div>

            <button type="submit" class="btn btn-primary w-100 mt-3" :disabled="loading">
              {{ loading ? 'Enviando...' : 'Registrar Usuario' }}
            </button>
            <div v-if="success" class="alert alert-success mt-3">Registro exitoso!</div>
            <div v-if="error" class="alert alert-danger mt-3">Error: {{ error }}</div>
          </form>
        </div>
        <div class="mt-3">
          <router-link :to="{ name: 'home' }" class="btn btn-link">Volver al Home</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import api from '../../services/api'; // Ruta relativa

interface UserData {
  idNumber: string;
  firstName: string;
  secondName: string;
  firstSurname: string;
  secondSurname: string;
  homeCity: string; // Usamos string para representar el UUID temporalmente
  email: string;
  mobileNumber: string;
}

const formData: UserData = reactive({
  idNumber: '',
  firstName: '',
  secondName: '',
  firstSurname: '',
  secondSurname: '',
  homeCity: '',
  email: '',
  mobileNumber: '',
});

const loading = ref(false);
const success = ref(false);
const error = ref<string | null>(null);

const submitForm = async () => {
  loading.value = true;
  success.value = false;
  error.value = null;

  try {
    // ✅ Endpoint correcto (UcoChallenge → /uco-challenge/api/v1/users → Gateway /api/v1/users)
    const response = await api.post('/api/v1/users', formData);
    success.value = true;
    console.log('Registro exitoso:', response.data);
    // Si deseas limpiar el formulario después del registro:
    // Object.keys(formData).forEach(key => (formData[key] = ''));
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Fallo al conectar o token inválido.';
  } finally {
    loading.value = false;
  }
};
</script>