<script setup lang="ts">
import Navbar from "./components/layout/Navbar.vue";
</script>

<template>
  <div id="app-container">
    <Navbar/>
    <div class="page-content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>

</style>
