// Servicio para obtener catálogos del backend (ciudades, tipos de ID, etc.)
import api from './api'

export interface City {
  id: string
  name: string
  // Puedes agregar más campos según la respuesta del backend
}

export interface IdType {
  id: string
  name: string
  code?: string
  // Puedes agregar más campos según la respuesta del backend
}

/**
 * Obtiene la lista de ciudades disponibles
 * 
 * RUTAS DEL BACKEND (ajustar según corresponda):
 * - GET http://localhost:8090/api/v1/cities
 * - GET http://localhost:8090/catalog/cities
 * - GET http://localhost:8090/api/v1/catalog/cities
 * 
 * Formato esperado de respuesta:
 * [
 *   { "id": "uuid-o-codigo", "name": "Nombre de la ciudad" },
 *   ...
 * ]
 */
export async function getCities(): Promise<City[]> {
  try {
    // Cambiar esta ruta según tu backend
    // Ejemplos de rutas comunes:
    // '/api/v1/cities'
    // '/catalog/cities'
    // '/api/v1/catalog/cities'
    const response = await api.get<City[]>('/api/v1/cities')
    return response.data || []
  } catch (error) {
    // Si el endpoint no existe, retornar array vacío
    if (import.meta.env.DEV) {
      console.warn('No se pudo obtener las ciudades desde el backend. Verifica la ruta en catalog.service.ts', error)
      console.warn('Ruta intentada: GET /api/v1/cities')
    }
    return []
  }
}

/**
 * Obtiene la lista de tipos de identificación disponibles
 * 
 * RUTAS DEL BACKEND (ajustar según corresponda):
 * - GET http://localhost:8090/api/v1/id-types
 * - GET http://localhost:8090/catalog/id-types
 * - GET http://localhost:8090/api/v1/catalog/id-types
 * 
 * Formato esperado de respuesta:
 * [
 *   { "id": "CC", "name": "Cédula de Ciudadanía", "code": "CC" },
 *   ...
 * ]
 * 
 * Si el backend no está disponible, se usan valores por defecto comunes.
 */
export async function getIdTypes(): Promise<IdType[]> {
  try {
    // Cambiar esta ruta según tu backend
    // Ejemplos de rutas comunes:
    // '/api/v1/id-types'
    // '/catalog/id-types'
    // '/api/v1/catalog/id-types'
    const response = await api.get<IdType[]>('/api/v1/id-types')
    return response.data || []
  } catch (error) {
    // Si el endpoint no existe, retornar valores por defecto comunes
    if (import.meta.env.DEV) {
      console.warn('No se pudo obtener los tipos de ID desde el backend. Usando lista por defecto.', error)
      console.warn('Ruta intentada: GET /api/v1/id-types')
    }
    // Valores por defecto comunes en muchos países
    return [
      { id: 'CC', name: 'Cédula de Ciudadanía', code: 'CC' },
      { id: 'CE', name: 'Cédula de Extranjería', code: 'CE' },
      { id: 'PA', name: 'Pasaporte', code: 'PA' },
      { id: 'TI', name: 'Tarjeta de Identidad', code: 'TI' },
      { id: 'NIT', name: 'Número de Identificación Tributaria', code: 'NIT' },
    ]
  }
}

