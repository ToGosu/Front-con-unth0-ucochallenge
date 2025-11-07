<script setup lang="ts">
import { useAuth } from "../../composables/useAuth"

const { logout } = useAuth()

const handleLogout = async () => {
  await logout()
}
</script>

<template>
  <button @click="handleLogout" class="btn btn-danger">
    Cerrar Sesión
  </button>
</template>
