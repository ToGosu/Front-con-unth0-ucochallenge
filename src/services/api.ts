import axios, { type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { envConfig } from '../config/env'
import { useAuthStore } from '../stores/auth'
import router from '../router'

const baseURL = envConfig.apiBaseUrl || 'https://localhost:8443/uco-challenge'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

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

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore()
    
    let token = authStore.accessToken
    
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

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    const authStore = useAuthStore()

    if (import.meta.env.DEV && error.response?.status === 405) {
      if (originalRequest?.method?.toUpperCase() === 'OPTIONS') {
        console.debug('Preflight OPTIONS request returned 405, but actual request may succeed')
        return Promise.resolve({
          status: 200,
          statusText: 'OK',
          data: {},
          headers: {},
          config: originalRequest,
        } as AxiosResponse)
      }
    }

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
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
        const newToken = await authStore.fetchAndSetToken()
        
        if (newToken) {
          processQueue(null, newToken)
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
          }
          return api(originalRequest)
        } else {
          throw new Error('No se pudo obtener un nuevo token')
        }
      } catch (refreshError) {
        processQueue(error as AxiosError, null)
        authStore.clearAuth()
        
        if (router.currentRoute.value.name !== 'login' && router.currentRoute.value.name !== 'home') {
          router.push({ name: 'home' })
        }
        
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
