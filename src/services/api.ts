// src/services/api.ts

import axios, { type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { envConfig } from '../config/env'
import { useAuthStore } from '../stores/auth'
import router from '../router'

// Usar la URL base configurada en las variables de entorno
// Por defecto: https://localhost:8443/uco-challenge
const baseURL = envConfig.apiBaseUrl || 'https://localhost:8443/uco-challenge'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10 segundos (según documentación)
  // Nota: En navegadores, los certificados autofirmados se manejan automáticamente
  // cuando el usuario acepta la excepción de seguridad en el navegador.
  // Para Node.js/SSR, se necesitaría configurar httpsAgent, pero no es necesario aquí.
})

// Flag para evitar loops infinitos de refresh
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  
  failedQueue = []
}

// Interceptor de requests: agrega el token a cada request
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore()
    
    // Obtener el token actual o refrescarlo si es necesario
    let token = authStore.accessToken
    
    // Si no hay token pero el usuario está autenticado, intentar obtenerlo
    if (!token && authStore.isAuth) {
      try {
        token = await authStore.fetchAndSetToken()
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('No se pudo obtener el token en el interceptor:', error)
        }
      }
    }
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor de respuestas: maneja errores 401/403 y refresh de tokens
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    const authStore = useAuthStore()

    // En desarrollo, ignorar errores 405 (Method Not Allowed) si la petición real funciona
    // Esto puede ocurrir cuando hay un preflight OPTIONS que falla pero el POST real funciona
    if (import.meta.env.DEV && error.response?.status === 405) {
      // Si la petición no es OPTIONS, podría ser un problema real, pero lo registramos silenciosamente
      if (originalRequest?.method?.toUpperCase() === 'OPTIONS') {
        // Ignorar errores de preflight OPTIONS en desarrollo si el proxy no los maneja correctamente
        console.debug('Preflight OPTIONS request returned 405, but actual request may succeed')
        // Retornar una respuesta simulada para que no falle la petición
        return Promise.resolve({
          status: 200,
          statusText: 'OK',
          data: {},
          headers: {},
          config: originalRequest,
        } as AxiosResponse)
      }
    }

    // Si es un error 401/403 y aún no hemos intentado refrescar
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // Si ya estamos refrescando, agregar el request a la cola
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return api(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Intentar refrescar el token
        const newToken = await authStore.fetchAndSetToken()
        
        if (newToken) {
          processQueue(null, newToken)
          
          // Reintentar el request original con el nuevo token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
          }
          return api(originalRequest)
        } else {
          throw new Error('No se pudo obtener un nuevo token')
        }
      } catch (refreshError) {
        // Si el refresh falla, limpiar autenticación y redirigir
        processQueue(error as AxiosError, null)
        authStore.clearAuth()
        
        // Redirigir al login si no estamos ya ahí
        if (router.currentRoute.value.name !== 'login' && router.currentRoute.value.name !== 'home') {
          router.push({ name: 'home' })
        }
        
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Para otros errores, simplemente rechazar
    return Promise.reject(error)
  }
)

export default api
