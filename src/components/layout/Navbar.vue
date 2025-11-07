<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuth } from "../../composables/useAuth.ts";
import LogoutButton from "../auth/LogoutButton.vue";

const { isAuthenticated, user, isLoading } = useAuth()
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
          <li class="nav-item" v-if="!isLoading && isAuthenticated">
            <RouterLink class="nav-link" to="/dashboard">Dashboard</RouterLink>
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item" v-if="isLoading">
            <span class="nav-link text-white-50">Cargando...</span>
          </li>
          <li class="nav-item" v-else-if="isAuthenticated">
            <span class="nav-link">Hola, {{ user?.name || user?.email }}</span>
          </li>
          <li class="nav-item" v-if="!isLoading && !isAuthenticated">
            <RouterLink class="nav-link btn btn-primary text-white" to="/login">Iniciar Sesión</RouterLink>
          </li>
          <li class="nav-item" v-else-if="!isLoading && isAuthenticated">
            <LogoutButton />
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
