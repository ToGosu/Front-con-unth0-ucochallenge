interface EnvConfig {
  auth0Domain: string
  auth0ClientId: string
  auth0Audience: string
  apiBaseUrl: string
}

function requireEnv(key: string): string {
  const value = import.meta.env[key]
  
  if (!value || value.trim() === '') {
    throw new Error(
      `Variable de entorno requerida faltante: ${key}\n` +
      `Por favor, crea un archivo .env en la raíz del proyecto con esta variable.`
    )
  }
  
  return value
}

function getEnv(key: string, defaultValue?: string): string {
  const value = import.meta.env[key]
  return value || defaultValue || ''
}

export function getEnvConfig(): EnvConfig {
  const auth0Domain = requireEnv('VITE_AUTH0_DOMAIN')
  const auth0ClientId = requireEnv('VITE_AUTH0_CLIENT_ID')
  const auth0Audience = requireEnv('VITE_AUTH0_AUDIENCE')
  
  const apiBaseUrl = getEnv('VITE_API_URL', 'https://localhost:8443/uco-challenge')
  
  return {
    auth0Domain,
    auth0ClientId,
    auth0Audience,
    apiBaseUrl,
  }
}

export const envConfig = getEnvConfig()

