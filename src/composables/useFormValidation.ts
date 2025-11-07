import { ref, computed } from 'vue'

export interface ValidationRule {
  validator: (value: string) => boolean
  message: string
}

export interface FieldValidation {
  value: string
  rules: ValidationRule[]
  touched: boolean
  error: string | null
}

/**
 * Composable para validación de formularios
 */
export function useFormValidation<T extends Record<string, FieldValidation>>(
  fields: T
) {
  const fieldsState = ref(fields)
  const isValid = computed(() => {
    return Object.values(fieldsState.value).every(
      (field) => !field.error && field.touched
    )
  })

  const validateField = (fieldName: keyof T) => {
    const field = fieldsState.value[fieldName]
    field.touched = true

    for (const rule of field.rules) {
      if (!rule.validator(field.value)) {
        field.error = rule.message
        return false
      }
    }

    field.error = null
    return true
  }

  const validateAll = (): boolean => {
    let allValid = true
    Object.keys(fieldsState.value).forEach((key) => {
      if (!validateField(key as keyof T)) {
        allValid = false
      }
    })
    return allValid
  }

  const reset = () => {
    Object.keys(fieldsState.value).forEach((key) => {
      const field = fieldsState.value[key as keyof T]
      field.value = ''
      field.error = null
      field.touched = false
    })
  }

  return {
    fieldsState,
    isValid,
    validateField,
    validateAll,
    reset,
  }
}

/**
 * Reglas de validación comunes
 */
export const validationRules = {
  required: (message = 'Este campo es requerido'): ValidationRule => ({
    validator: (value) => value.trim().length > 0,
    message,
  }),

  email: (message = 'Email inválido'): ValidationRule => ({
    validator: (value) => {
      if (!value.trim()) return true // Si está vacío, required se encargará
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value)
    },
    message,
  }),

  minLength: (
    min: number,
    message?: string
  ): ValidationRule => ({
    validator: (value) => value.trim().length >= min,
    message: message || `Debe tener al menos ${min} caracteres`,
  }),

  maxLength: (
    max: number,
    message?: string
  ): ValidationRule => ({
    validator: (value) => value.trim().length <= max,
    message: message || `Debe tener máximo ${max} caracteres`,
  }),

  phone: (message = 'Teléfono inválido'): ValidationRule => ({
    validator: (value) => {
      if (!value.trim()) return true
      // Acepta números con o sin espacios, guiones, paréntesis
      const phoneRegex = /^[\d\s\-\(\)]+$/
      return phoneRegex.test(value) && value.replace(/\D/g, '').length >= 7
    },
    message,
  }),

  alphanumeric: (message = 'Solo se permiten letras y números'): ValidationRule => ({
    validator: (value) => {
      if (!value.trim()) return true
      const alphanumericRegex = /^[a-zA-Z0-9\s]+$/
      return alphanumericRegex.test(value)
    },
    message,
  }),

  numeric: (message = 'Solo se permiten números'): ValidationRule => ({
    validator: (value) => {
      if (!value.trim()) return true
      return /^\d+$/.test(value)
    },
    message,
  }),

  lettersOnly: (message = 'Solo se permiten letras y espacios'): ValidationRule => ({
    validator: (value) => {
      if (!value.trim()) return true
      // Permite letras (incluyendo acentos y ñ) y espacios
      const lettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/
      return lettersRegex.test(value)
    },
    message,
  }),

  lettersAndSpaces: (message = 'Solo se permiten letras y espacios'): ValidationRule => ({
    validator: (value) => {
      if (!value.trim()) return true
      // Permite letras (incluyendo acentos y ñ), espacios, guiones y apóstrofes
      const lettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']+$/
      return lettersRegex.test(value)
    },
    message,
  }),
}

