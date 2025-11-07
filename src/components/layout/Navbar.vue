<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import LogoutButton from '../auth/LogoutButton.vue'

const authStore = useAuthStore()
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/">UcoChallenge Frontend</RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Inicio</RouterLink>
          </li>
          <li class="nav-item" v-if="!authStore.loading && authStore.isAuth">
            <RouterLink class="nav-link" to="/dashboard">Dashboard</RouterLink>
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item" v-if="authStore.loading">
            <span class="nav-link text-white-50">Cargando...</span>
          </li>
          <li class="nav-item" v-else-if="authStore.isAuth">
            <span class="nav-link">Hola, {{ authStore.currentUser?.name || authStore.currentUser?.nickname || authStore.currentUser?.email }}</span>
          </li>
          <li class="nav-item" v-if="!authStore.loading && !authStore.isAuth">
            <RouterLink class="nav-link btn btn-primary text-white" to="/login">Iniciar Sesión</RouterLink>
          </li>
          <li class="nav-item" v-else-if="!authStore.loading && authStore.isAuth">
            <LogoutButton />
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
