import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'

const ROLES_CLAIM_NAMESPACE = 'https://api-uco-challenge.com/roles'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const userRoles = ref<string[]>([])

  const { isAuthenticated, user, isLoading, getAccessTokenSilently, loginWithRedirect, logout } = useAuth0()

  const isAuth = computed(() => isAuthenticated.value)
  const currentUser = computed(() => user.value)
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
      const audience = (import.meta.env.VITE_AUTH0_AUDIENCE as string) || 'https://ucochallenge-api/'

      const token = await getAccessTokenSilently({ authorizationParams: { audience } })

      accessToken.value = token
      console.log('🔑 Token obtenido:', token)

      const claims = (user.value as any) || {}
      const rolesClaim = claims[ROLES_CLAIM_NAMESPACE] || []
      userRoles.value = Array.isArray(rolesClaim) ? rolesClaim : [rolesClaim]

      if (userRoles.value.length === 0) userRoles.value = ['client']

      console.log('👥 Roles asignados:', userRoles.value)
      return token
    } catch (err) {
      console.error('❌ Error obteniendo token:', err)
      clearAuth()
      return null
    }
  }

  const auth0Login = async (options?: any) => {
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
