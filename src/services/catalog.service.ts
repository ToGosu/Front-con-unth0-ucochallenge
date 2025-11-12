import api from './api'

export interface City {
  id: string
  name: string
}

export interface IdType {
  id: string
  name: string
  code?: string
}

export async function getCities(): Promise<City[]> {
  try {
    const response = await api.get<City[]>('/api/v1/cities')
    return response.data || []
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('No se pudo obtener las ciudades desde el backend. Verifica la ruta en catalog.service.ts', error)
      console.warn('Ruta intentada: GET /api/v1/cities')
    }
    return []
  }
}

export async function getIdTypes(): Promise<IdType[]> {
  try {
    const response = await api.get<IdType[]>('/api/v1/idtypes')
    return response.data || []
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('No se pudo obtener los tipos de ID desde el backend. Usando lista por defecto.', error)
      console.warn('Ruta intentada: GET /api/v1/idtypes')
    }
    return [
      { id: 'CC', name: 'Cédula de Ciudadanía', code: 'CC' },
      { id: 'CE', name: 'Cédula de Extranjería', code: 'CE' },
      { id: 'PA', name: 'Pasaporte', code: 'PA' },
      { id: 'TI', name: 'Tarjeta de Identidad', code: 'TI' },
      { id: 'NIT', name: 'Número de Identificación Tributaria', code: 'NIT' },
    ]
  }
}

