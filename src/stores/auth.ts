import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { envConfig } from '../config/env'

const ROLES_CLAIM_NAMESPACE = 'https://api-uco-challenge.com/roles'

interface Auth0User {
  sub?: string
  name?: string
  nickname?: string
  email?: string
  picture?: string
  [ROLES_CLAIM_NAMESPACE]?: string[] | string
  [key: string]: unknown
}

interface LoginOptions {
  appState?: {
    target?: string
  }
}

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

      if (isDevelopment) {
        console.log('Token obtenido exitosamente')
      }

      const authUser = user.value as Auth0User | undefined
      if (authUser) {
        const rolesClaim = authUser[ROLES_CLAIM_NAMESPACE]
        userRoles.value = Array.isArray(rolesClaim) 
          ? rolesClaim 
          : rolesClaim 
            ? [rolesClaim] 
            : []

        if (userRoles.value.length === 0) {
          userRoles.value = ['client']
        }
        
        if (isDevelopment && userRoles.value.includes('admin')) {
          console.log('Usuario tiene rol admin - verificar que esté correctamente asignado en Auth0')
        }

        if (isDevelopment) {
          console.log('Roles asignados:', userRoles.value)
        }
      }

      return token
    } catch (err) {
      if (isDevelopment) {
        console.error('Error obteniendo token:', err)
      }
      
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
