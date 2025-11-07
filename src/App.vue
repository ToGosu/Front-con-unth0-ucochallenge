<script setup lang="ts">
import Navbar from './components/layout/Navbar.vue'
import NotificationToast from './components/ui/NotificationToast.vue'
</script>

<template>
  <div id="app-container">
    <Navbar />
    <div class="page-content">
      <router-view />
    </div>
    <NotificationToast />
  </div>
</template>

<style scoped>

</style>
