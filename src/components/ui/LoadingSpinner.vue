<template>
  <div class="loading-spinner text-center" :class="containerClass">
    <div class="spinner-border" :class="spinnerClass" role="status">
      <span class="visually-hidden">{{ message }}</span>
    </div>
    <p v-if="message" class="mt-2">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
  containerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  message: 'Cargando...',
  size: 'md',
  variant: 'primary',
  containerClass: '',
})

const spinnerClass = computed(() => {
  const classes: string[] = [`text-${props.variant}`]
  if (props.size === 'sm') classes.push('spinner-border-sm')
  return classes.join(' ')
})
</script>

<style scoped>
.loading-spinner {
  padding: 1rem;
}
</style>

