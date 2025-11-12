<template>
  <div class="card p-4 shadow-sm confirm-email-form">
    <h3 class="card-title text-center mb-4">Confirmar Correo Electrónico</h3>
    
    <!-- Mensaje informativo con el email -->
    <div v-if="email" class="alert alert-info mb-4" role="alert">
      <strong>ℹ️</strong> Se ha enviado un código de verificación a tu correo electrónico: <strong>{{ email }}</strong>
    </div>
    <p v-else class="text-center text-muted mb-4">
      Ingresa el código de 6 dígitos que recibiste por correo electrónico
    </p>

    <form @submit.prevent="handleConfirm" novalidate>
      <!-- Campo OTP de 6 dígitos -->
      <div class="otp-container mb-4">
        <div class="otp-inputs d-flex justify-content-center gap-2">
          <input
            v-for="(digit, index) in codeDigits"
            :key="index"
            :ref="(el) => setInputRef(el, index)"
            v-model="codeDigits[index]"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="1"
            class="otp-input form-control text-center"
            :class="{ 'is-invalid': error && !isValidCode }"
            :disabled="loading || isConfirmed"
            @input="handleInput(index, $event)"
            @keydown="handleKeydown(index, $event)"
            @paste="handlePaste($event)"
            @focus="handleFocus(index)"
            autocomplete="one-time-code"
            :aria-label="`Dígito ${index + 1} del código de confirmación`"
          />
        </div>
      </div>

      <!-- Mensaje de error -->
      <div v-if="error" class="alert alert-danger mb-3" role="alert">
        <strong>⚠️</strong> {{ error }}
      </div>

      <!-- Mensaje de éxito -->
      <div v-if="isConfirmed" class="alert alert-success mb-3" role="alert">
        <strong>✓</strong> {{ successMessage }}
      </div>

      <!-- Botón de confirmar -->
      <button
        type="submit"
        class="btn btn-primary btn-lg w-100"
        :disabled="!isValidCode || loading || isConfirmed"
      >
        <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        <span v-else-if="isConfirmed">
          ✓ Confirmado
        </span>
        <span v-else>Confirmar Correo</span>
      </button>

      <!-- Opción para reenviar código -->
      <div v-if="!isConfirmed" class="text-center mt-3">
        <button
          type="button"
          class="btn btn-link text-decoration-none"
          @click="handleResend"
          :disabled="loading || resending"
        >
          <span v-if="resending" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          No recibí el código
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import api from '../../services/api'
import { useNotificationsStore } from '../../stores/notifications'

interface Props {
  email?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

const props = withDefaults(defineProps<Props>(), {
  email: '',
  onSuccess: undefined,
  onError: undefined,
})

const emit = defineEmits<{
  confirmed: []
  error: [message: string]
}>()

const notifications = useNotificationsStore()

// Estado del código OTP
const codeDigits = ref<string[]>(['', '', '', '', '', ''])
const inputRefs = ref<(HTMLInputElement | null)[]>([])

// Estado del formulario
const loading = ref(false)
const resending = ref(false)
const error = ref<string | null>(null)
const isConfirmed = ref(false)
const successMessage = ref('Correo electrónico confirmado exitosamente')

// Computed para validar el código
const isValidCode = computed(() => {
  return codeDigits.value.every(digit => /^\d$/.test(digit)) && 
         codeDigits.value.join('').length === 6
})

// Función para establecer referencias de inputs
const setInputRef = (el: HTMLInputElement | null, index: number) => {
  if (el) {
    inputRefs.value[index] = el
  }
}

// Manejar input en cada campo
const handleInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value

  // Solo permitir números
  value = value.replace(/\D/g, '')

  if (value.length > 1) {
    // Si se pega más de un dígito, tomar solo el primero
    value = value[0]
  }

  codeDigits.value[index] = value
  error.value = null

  // Auto-avance al siguiente campo si hay un valor
  if (value && index < 5) {
    nextTick(() => {
      inputRefs.value[index + 1]?.focus()
    })
  }
}

// Manejar teclas especiales
const handleKeydown = (index: number, event: KeyboardEvent) => {
  // Backspace: borrar y retroceder
  if (event.key === 'Backspace' && !codeDigits.value[index] && index > 0) {
    event.preventDefault()
    inputRefs.value[index - 1]?.focus()
  }

  // Flecha izquierda: retroceder
  if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault()
    inputRefs.value[index - 1]?.focus()
  }

  // Flecha derecha: avanzar
  if (event.key === 'ArrowRight' && index < 5) {
    event.preventDefault()
    inputRefs.value[index + 1]?.focus()
  }

  // Permitir solo números, backspace, delete, arrow keys, tab
  if (!/^[0-9]$/.test(event.key) && 
      !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key)) {
    event.preventDefault()
  }
}

// Manejar pegado de código completo
const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text') || ''
  const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('')

  // Llenar los campos con los dígitos pegados
  digits.forEach((digit, index) => {
    if (index < 6) {
      codeDigits.value[index] = digit
    }
  })

  // Enfocar el último campo llenado o el siguiente vacío
  const nextEmptyIndex = codeDigits.value.findIndex(d => !d)
  const focusIndex = nextEmptyIndex === -1 ? 5 : Math.min(nextEmptyIndex, 5)
  
  nextTick(() => {
    inputRefs.value[focusIndex]?.focus()
  })
}

// Manejar focus
const handleFocus = (index: number) => {
  // Seleccionar el contenido del campo al enfocarlo
  nextTick(() => {
    inputRefs.value[index]?.select()
  })
}

// Confirmar código
const handleConfirm = async () => {
  if (!isValidCode.value) {
    error.value = 'Por favor ingresa un código de 6 dígitos válido'
    return
  }

  const code = codeDigits.value.join('')
  loading.value = true
  error.value = null

  try {
    const response = await api.post(`/v1/users/confirm-email?code=${code}`)
    
    // Éxito
    isConfirmed.value = true
    successMessage.value = response.data?.message || 'Correo electrónico confirmado exitosamente'
    notifications.success('¡Código verificado exitosamente! Tu correo electrónico ha sido confirmado.')
    
    emit('confirmed')
    if (props.onSuccess) {
      props.onSuccess()
    }
  } catch (err: any) {
    // Manejar errores del backend
    let errorMessage = 'Error al confirmar el código'
    
    if (err.response?.status === 400) {
      const backendMessage = err.response?.data?.message || err.response?.data?.error
      
      if (backendMessage) {
        errorMessage = backendMessage
      } else {
        errorMessage = 'Código de confirmación inválido'
      }
    } else if (err.response?.status === 401 || err.response?.status === 403) {
      errorMessage = 'No tienes permisos para realizar esta acción'
    } else if (err.response?.status >= 500) {
      errorMessage = 'Error del servidor. Por favor intenta más tarde'
    } else if (err.message) {
      errorMessage = err.message
    }

    error.value = errorMessage
    notifications.error(errorMessage)
    
    emit('error', errorMessage)
    if (props.onError) {
      props.onError(errorMessage)
    }

    // Limpiar el código y enfocar el primer campo
    codeDigits.value = ['', '', '', '', '', '']
    nextTick(() => {
      inputRefs.value[0]?.focus()
    })
  } finally {
    loading.value = false
  }
}

// Reenviar código (placeholder - implementar según necesidad)
const handleResend = async () => {
  resending.value = true
  error.value = null

  try {
    // TODO: Implementar endpoint de reenvío de código si existe
    // await api.post('/v1/users/resend-email-code')
    notifications.info('Funcionalidad de reenvío de código próximamente disponible')
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Error al reenviar el código'
    notifications.error(errorMessage)
    error.value = errorMessage
  } finally {
    resending.value = false
  }
}

// Enfocar el primer campo al montar
onMounted(() => {
  nextTick(() => {
    inputRefs.value[0]?.focus()
  })
})
</script>

<style scoped>
.confirm-email-form {
  max-width: 500px;
  margin: 2rem auto;
}

.otp-container {
  margin: 2rem 0;
}

.otp-inputs {
  flex-wrap: wrap;
}

.otp-input {
  width: 3.5rem;
  height: 3.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.otp-input:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  outline: none;
}

.otp-input.is-invalid {
  border-color: #dc3545;
}

.otp-input:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}

.otp-input:not(:disabled):hover {
  border-color: #adb5bd;
}

/* Responsive para móviles */
@media (max-width: 576px) {
  .otp-input {
    width: 3rem;
    height: 3rem;
    font-size: 1.25rem;
  }

  .otp-inputs {
    gap: 0.5rem !important;
  }
}

/* Animación suave para el estado de confirmado */
.alert-success {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

