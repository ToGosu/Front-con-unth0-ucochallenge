import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { envConfig } from '../config/env'

const ROLES_CLAIM_NAMESPACE = 'https://api-uco-challenge.com/roles'

// Tipo para el usuario de Auth0 con claims personalizados
interface Auth0User {
  sub?: string
  name?: string
  nickname?: string
  email?: string
  picture?: string
  [ROLES_CLAIM_NAMESPACE]?: string[] | string
  [key: string]: unknown
}

// Tipo para opciones de login
interface LoginOptions {
  appState?: {
    target?: string
  }
}

// Helper para detectar si estamos en desarrollo
const isDevelopment = import.meta.env.DEV

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const userRoles = ref<string[]>([])

  const { isAuthenticated, user, isLoading, getAccessTokenSilently, loginWithRedirect, logout } = useAuth0()

  const isAuth = computed(() => isAuthenticated.value)
  const currentUser = computed(() => user.value as Auth0User | undefined)
  const loading = computed(() => isLoading.value)

  const setAccessToken = (token: string | null) => (accessToken.value = token)

  const clearAuth = () => {
    accessToken.value = null
    userRoles.value = []
    logout({ logoutParams: { returnTo: window.location.origin } })
  }

  const hasRole = (roleName: string): boolean => userRoles.value.includes(roleName)

  const fetchAndSetToken = async (): Promise<string | null> => {
    try {
      const token = await getAccessTokenSilently({ 
        authorizationParams: { 
          audience: envConfig.auth0Audience 
        } 
      })

      accessToken.value = token

      // Solo loggear en desarrollo
      if (isDevelopment) {
        console.log('🔑 Token obtenido exitosamente')
      }

      // Extraer roles del usuario
      const authUser = user.value as Auth0User | undefined
      if (authUser) {
        const rolesClaim = authUser[ROLES_CLAIM_NAMESPACE]
        userRoles.value = Array.isArray(rolesClaim) 
          ? rolesClaim 
          : rolesClaim 
            ? [rolesClaim] 
            : []

        // Si no hay roles, asignar rol por defecto (nunca 'admin')
        if (userRoles.value.length === 0) {
          userRoles.value = ['client']
        }
        
        // Asegurar que nunca se asigne 'admin' por defecto
        // Si el usuario tiene el rol 'admin', debe venir explícitamente de Auth0
        if (isDevelopment && userRoles.value.includes('admin')) {
          console.log('⚠️ Usuario tiene rol admin - verificar que esté correctamente asignado en Auth0')
        }

        if (isDevelopment) {
          console.log('👥 Roles asignados:', userRoles.value)
        }
      }

      return token
    } catch (err) {
      // En producción, solo loggear errores críticos
      if (isDevelopment) {
        console.error('❌ Error obteniendo token:', err)
      }
      
      // No limpiar auth automáticamente aquí, dejar que el interceptor lo maneje
      // para evitar loops infinitos
      return null
    }
  }

  const auth0Login = async (options?: LoginOptions) => {
    await loginWithRedirect(options)
  }

  return {
    accessToken,
    userRoles,
    isAuth,
    currentUser,
    loading,
    setAccessToken,
    clearAuth,
    fetchAndSetToken,
    hasRole,
    auth0Login,
  }
})
