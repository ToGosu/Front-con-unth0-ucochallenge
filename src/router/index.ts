// src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router'
import { watch } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import ProfileView from '../views/Profile.vue'
import RegisterUserView from '../views/admin/RegisterUserView.vue'
import ListUsersView from '../views/admin/ListUsersView.vue'
import Callback from '../views/Callback.vue'

import { useAuth0 } from '@auth0/auth0-vue'
import { useAuthStore } from '../stores/auth'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/callback', name: 'callback', component: Callback },
  { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/admin/register', name: 'admin.register', component: RegisterUserView, meta: { requiresAuth: true, roles: ['admin'] } },
  { path: '/admin/list', name: 'admin.list', component: ListUsersView, meta: { requiresAuth: true, roles: ['admin'] } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// 🔐 Middleware de autenticación
router.beforeEach(async (to, _from, next) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0()
  const authStore = useAuthStore()

  // Espera a que Auth0 se inicialice
  if (isLoading.value) {
    await new Promise<void>((resolve) => {
      const stop = watch(isLoading, (val) => {
        if (!val) {
          stop()
          resolve()
        }
      })
    })
  }

  // Si requiere autenticación
  if ((to.meta as any)?.requiresAuth) {
    if (!isAuthenticated.value) {
      await loginWithRedirect({ appState: { target: to.fullPath } })
      return next(false)
    }

    // Intentar obtener el token si no existe
    if (!authStore.accessToken) {
      const token = await authStore.fetchAndSetToken().catch(() => null)

      if (!token) {
        console.warn('Token expirado o sesión inválida. Redirigiendo...')
        authStore.clearAuth()
        return next({ name: 'home' })
      }
    }

    // Validar roles si la ruta los requiere
    const requiredRoles: string[] = (to.meta as any).roles || []
    if (requiredRoles.length > 0) {
      const hasRole = requiredRoles.some((r) => authStore.hasRole(r))
      if (!hasRole) return next({ name: 'home' })
    }
  }

  next()
})

export default router
