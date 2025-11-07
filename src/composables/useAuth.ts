import { useAuth0 } from '@auth0/auth0-vue'
import { computed } from 'vue'

export function useAuth() {
  const auth0 = useAuth0()

  const isAuthenticated = computed(() => auth0.isAuthenticated.value)
  const user = computed(() => auth0.user.value)
  const isLoading = computed(() => auth0.isLoading.value)

  const login = async () => {
    await auth0.loginWithRedirect()
  }

  const logout = async () => {
    await auth0.logout({ logoutParams: { returnTo: window.location.origin } })
  }

  const getAccessToken = async (): Promise<string | null> => {
    try {
      const token = await auth0.getAccessTokenSilently()
      return token || null
    } catch (error) {
      console.error('❌ Error al obtener el token de acceso:', error)
      return null
    }
  }

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    getAccessToken,
  }
}
