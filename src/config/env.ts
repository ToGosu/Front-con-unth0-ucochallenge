/**
 * Configuración y validación de variables de entorno
 */

interface EnvConfig {
  auth0Domain: string
  auth0ClientId: string
  auth0Audience: string
  apiBaseUrl: string
}

/**
 * Valida que una variable de entorno exista y no esté vacía
 */
function requireEnv(key: string): string {
  const value = import.meta.env[key]
  
  if (!value || value.trim() === '') {
    throw new Error(
      `❌ Variable de entorno requerida faltante: ${key}\n` +
      `Por favor, crea un archivo .env en la raíz del proyecto con esta variable.`
    )
  }
  
  return value
}

/**
 * Obtiene una variable de entorno con un valor por defecto opcional
 */
function getEnv(key: string, defaultValue?: string): string {
  const value = import.meta.env[key]
  return value || defaultValue || ''
}

/**
 * Valida y retorna la configuración de variables de entorno
 */
export function getEnvConfig(): EnvConfig {
  // Variables requeridas (sin valores por defecto en producción)
  const auth0Domain = requireEnv('VITE_AUTH0_DOMAIN')
  const auth0ClientId = requireEnv('VITE_AUTH0_CLIENT_ID')
  const auth0Audience = requireEnv('VITE_AUTH0_AUDIENCE')
  
  // Variables opcionales con valores por defecto
  // Nueva URL HTTPS a través del Nginx WAF
  const apiBaseUrl = getEnv('VITE_API_URL', 'https://localhost:8443/uco-challenge')
  
  return {
    auth0Domain,
    auth0ClientId,
    auth0Audience,
    apiBaseUrl,
  }
}

/**
 * Configuración validada de variables de entorno
 * Se valida al importar el módulo
 */
export const envConfig = getEnvConfig()

