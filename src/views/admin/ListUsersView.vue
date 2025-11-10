<template>
  <div class="container mt-5">
    <div class="card shadow-sm p-4">
      <h2 class="mb-4 text-center">Registros de Usuarios Existentes</h2>

      <button @click="reloadData" class="btn btn-success mb-3" :disabled="loading || loadingCities">
        {{ loading || loadingCities ? 'Cargando...' : 'Recargar Lista' }}
      </button>

      <LoadingSpinner v-if="loading && users.length === 0" message="Cargando usuarios..." />

      <div v-else-if="users.length > 0">
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Completo</th>
              <th>Email</th>
              <th>Ciudad</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="user in users" :key="user.idNumber">
              <td>{{ user.idNumber }}</td>
              <td>{{ user.firstName }} {{ user.firstSurname }}</td>
              <td>{{ user.email }}</td>
              <td>{{ getCityName(user.homeCity) }}</td>
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
import { ref, onMounted, computed } from 'vue'
import api from '../../services/api'
import { useNotificationsStore } from '../../stores/notifications'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'
import { getCities, type City } from '../../services/catalog.service'

interface UserRecord {
  idNumber: string
  firstName: string
  firstSurname: string
  email: string
  homeCity: string
  // ... otros campos
}

const notifications = useNotificationsStore()
const users = ref<UserRecord[]>([])
const loading = ref(false)
const cities = ref<City[]>([])
const loadingCities = ref(false)

// Crear un mapa de UUID a nombre de ciudad para búsqueda rápida
const cityMap = computed(() => {
  const map = new Map<string, string>()
  cities.value.forEach(city => {
    map.set(city.id, city.name)
  })
  return map
})

// Función para obtener el nombre de la ciudad a partir del UUID
const getCityName = (cityId: string): string => {
  if (!cityId) return 'N/A'
  return cityMap.value.get(cityId) || cityId // Si no se encuentra, mostrar el UUID como fallback
}

const fetchUsers = async () => {
  loading.value = true

  try {
    const response = await api.get('/v1/users')
    users.value = response.data || []
    
    if (users.value.length === 0) {
      notifications.info('No hay usuarios registrados')
    } else {
      notifications.success(`${users.value.length} usuario(s) cargado(s)`)
    }

    if (import.meta.env.DEV) {
      console.log('Usuarios obtenidos:', response.data)
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.message ||
                        'Error al cargar los usuarios. Asegúrate de tener el rol "admin" y que el Gateway esté activo.'
    notifications.error(errorMessage)
    users.value = []
    
    if (import.meta.env.DEV) {
      console.error('Error al cargar usuarios:', err)
    }
  } finally {
    loading.value = false
  }
}

// Función para cargar las ciudades
const loadCities = async () => {
  loadingCities.value = true
  try {
    cities.value = await getCities()
    if (import.meta.env.DEV) {
      console.log('Ciudades cargadas:', cities.value)
    }
  } catch (error) {
    console.error('Error al cargar ciudades:', error)
    notifications.warning('No se pudieron cargar las ciudades. Se mostrarán UUIDs.')
  } finally {
    loadingCities.value = false
  }
}

// Función para recargar tanto ciudades como usuarios
const reloadData = async () => {
  await loadCities()
  await fetchUsers()
}

// Cargar ciudades y usuarios al montar la vista
onMounted(async () => {
  await reloadData()
})
</script>