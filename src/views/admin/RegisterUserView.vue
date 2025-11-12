<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <!-- Componente de confirmación de número celular -->
        <div v-if="showConfirmForm" class="mb-4">
          <ConfirmMobileForm 
            @confirmed="handleMobileConfirmed"
            @error="handleConfirmError"
          />
          <div class="text-center mt-3">
            <button 
              @click="showConfirmForm = false; registeredMobileNumber = null" 
              class="btn btn-link"
            >
              Volver al formulario de registro
            </button>
          </div>
        </div>

        <!-- Formulario de registro -->
        <div v-else class="card shadow-sm p-4">
          <h2 class="mb-4 text-center">Registro de Nuevo Usuario</h2>
          
          <LoadingSpinner v-if="loading" message="Registrando usuario..." />
          
          <form v-else @submit.prevent="submitForm">
            <div class="row mb-3">
              <div class="col-md-4">
                <label for="idType" class="form-label">
                  Tipo de Identificación <span class="text-danger">*</span>
                </label>
                <select
                  class="form-select"
                  :class="{ 'is-invalid': fieldsState.idType.touched && fieldsState.idType.error }"
                  id="idType"
                  v-model="fieldsState.idType.value"
                  @blur="validateField('idType')"
                  @change="handleInput('idType')"
                  :disabled="loadingIdTypes"
                >
                  <option value="">Seleccione un tipo</option>
                  <option v-for="type in idTypes" :key="type.id" :value="type.id">
                    {{ type.name }}
                  </option>
                </select>
                <div v-if="loadingIdTypes" class="form-text">
                  <small class="text-muted">Cargando tipos de ID...</small>
                </div>
                <div v-if="fieldsState.idType.error" class="invalid-feedback">
                  {{ fieldsState.idType.error }}
                </div>
              </div>
              <div class="col-md-8">
                <label for="idNumber" class="form-label">
                  Número de Identificación <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': fieldsState.idNumber.touched && fieldsState.idNumber.error }"
                  id="idNumber"
                  v-model="fieldsState.idNumber.value"
                  @blur="validateField('idNumber')"
                  @input="handleInputNumeric('idNumber')"
                  @keypress="onlyNumbers"
                  maxlength="20"
                  placeholder="Solo números"
                />
                <div v-if="fieldsState.idNumber.error" class="invalid-feedback">
                  {{ fieldsState.idNumber.error }}
                </div>
              </div>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="firstName" class="form-label">
                  Primer Nombre <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': fieldsState.firstName.touched && fieldsState.firstName.error }"
                  id="firstName"
                  v-model="fieldsState.firstName.value"
                  @blur="validateField('firstName')"
                  @input="handleInputLetters('firstName')"
                  @keypress="onlyLetters"
                  maxlength="50"
                  placeholder="Solo letras"
                />
                <div v-if="fieldsState.firstName.error" class="invalid-feedback">
                  {{ fieldsState.firstName.error }}
                </div>
              </div>
              <div class="col-md-6">
                <label for="secondName" class="form-label">Segundo Nombre</label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': fieldsState.secondName.touched && fieldsState.secondName.error }"
                  id="secondName"
                  v-model="fieldsState.secondName.value"
                  @blur="validateField('secondName')"
                  @input="handleInputLetters('secondName')"
                  @keypress="onlyLetters"
                  maxlength="50"
                  placeholder="Solo letras"
                />
                <div v-if="fieldsState.secondName.error" class="invalid-feedback">
                  {{ fieldsState.secondName.error }}
                </div>
              </div>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="firstSurname" class="form-label">
                  Primer Apellido <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': fieldsState.firstSurname.touched && fieldsState.firstSurname.error }"
                  id="firstSurname"
                  v-model="fieldsState.firstSurname.value"
                  @blur="validateField('firstSurname')"
                  @input="handleInputLetters('firstSurname')"
                  @keypress="onlyLetters"
                  maxlength="50"
                  placeholder="Solo letras"
                />
                <div v-if="fieldsState.firstSurname.error" class="invalid-feedback">
                  {{ fieldsState.firstSurname.error }}
                </div>
              </div>
              <div class="col-md-6">
                <label for="secondSurname" class="form-label">Segundo Apellido</label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': fieldsState.secondSurname.touched && fieldsState.secondSurname.error }"
                  id="secondSurname"
                  v-model="fieldsState.secondSurname.value"
                  @blur="validateField('secondSurname')"
                  @input="handleInputLetters('secondSurname')"
                  @keypress="onlyLetters"
                  maxlength="50"
                  placeholder="Solo letras"
                />
                <div v-if="fieldsState.secondSurname.error" class="invalid-feedback">
                  {{ fieldsState.secondSurname.error }}
                </div>
              </div>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="homeCity" class="form-label">
                  Ciudad <span class="text-danger">*</span>
                </label>
                <select
                  class="form-select"
                  :class="{ 'is-invalid': fieldsState.homeCity.touched && fieldsState.homeCity.error }"
                  id="homeCity"
                  v-model="fieldsState.homeCity.value"
                  @blur="validateField('homeCity')"
                  @change="handleInput('homeCity')"
                  :disabled="loadingCities"
                >
                  <option value="">Seleccione una ciudad</option>
                  <option v-for="city in cities" :key="city.id" :value="city.id">
                    {{ city.name }}
                  </option>
                </select>
                <div v-if="loadingCities" class="form-text">
                  <small class="text-muted">Cargando ciudades...</small>
                </div>
                <div v-if="fieldsState.homeCity.error" class="invalid-feedback">
                  {{ fieldsState.homeCity.error }}
                </div>
              </div>
              <div class="col-md-6">
                <label for="email" class="form-label">
                  Email <span class="text-danger">*</span>
                </label>
                <input
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': fieldsState.email.touched && fieldsState.email.error }"
                  id="email"
                  v-model="fieldsState.email.value"
                  @blur="validateField('email')"
                  @input="handleInput('email')"
                  maxlength="100"
                  placeholder="ejemplo@correo.com"
                />
                <div v-if="fieldsState.email.error" class="invalid-feedback">
                  {{ fieldsState.email.error }}
                </div>
              </div>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="mobileNumber" class="form-label">
                  Teléfono Móvil <span class="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  class="form-control"
                  :class="{ 'is-invalid': fieldsState.mobileNumber.touched && fieldsState.mobileNumber.error }"
                  id="mobileNumber"
                  v-model="fieldsState.mobileNumber.value"
                  @blur="validateField('mobileNumber')"
                  @input="handlePhoneInput"
                  @keydown="handlePhoneKeydown"
                  @focus="handlePhoneFocus"
                  maxlength="13"
                  placeholder="+57 3001234567"
                />
                <div v-if="fieldsState.mobileNumber.error" class="invalid-feedback">
                  {{ fieldsState.mobileNumber.error }}
                </div>
              </div>
            </div>

            <button type="submit" class="btn btn-primary w-100 mt-3" :disabled="loading">
              Registrar Usuario
            </button>
          </form>
          <div class="mt-3">
            <router-link :to="{ name: 'home' }" class="btn btn-link">Volver al Home</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../../services/api'
import { useFormValidation, validationRules, type FieldValidation } from '../../composables/useFormValidation'
import { useNotificationsStore } from '../../stores/notifications'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'
import ConfirmMobileForm from '../../components/auth/ConfirmMobileForm.vue'
import { getCities, getIdTypes, type City, type IdType } from '../../services/catalog.service'

const notifications = useNotificationsStore()
const loading = ref(false)
const loadingCities = ref(false)
const loadingIdTypes = ref(false)
const cities = ref<City[]>([])
const idTypes = ref<IdType[]>([])
const showConfirmForm = ref(false)
const registeredMobileNumber = ref<string | null>(null)

const { fieldsState, validateField, validateAll, reset } = useFormValidation({
  idType: {
    value: '',
    rules: [
      validationRules.required('El tipo de identificación es requerido'),
    ],
    touched: false,
    error: null,
  } as FieldValidation,
  idNumber: {
    value: '',
    rules: [
      validationRules.required('El número de identificación es requerido'),
      validationRules.numeric('Solo se permiten números'),
      validationRules.minLength(5, 'Debe tener al menos 5 dígitos'),
      validationRules.maxLength(20, 'No puede exceder 20 dígitos'),
    ],
    touched: false,
    error: null,
  } as FieldValidation,
  firstName: {
    value: '',
    rules: [
      validationRules.required('El primer nombre es requerido'),
      validationRules.minLength(2, 'Debe tener al menos 2 caracteres'),
      validationRules.maxLength(50, 'No puede exceder 50 caracteres'),
      validationRules.lettersAndSpaces('Solo se permiten letras y espacios'),
    ],
    touched: false,
    error: null,
  } as FieldValidation,
  secondName: {
    value: '',
    rules: [
      validationRules.maxLength(50, 'No puede exceder 50 caracteres'),
      validationRules.lettersAndSpaces('Solo se permiten letras y espacios'),
    ],
    touched: false,
    error: null,
  } as FieldValidation,
  firstSurname: {
    value: '',
    rules: [
      validationRules.required('El primer apellido es requerido'),
      validationRules.minLength(2, 'Debe tener al menos 2 caracteres'),
      validationRules.maxLength(50, 'No puede exceder 50 caracteres'),
      validationRules.lettersAndSpaces('Solo se permiten letras y espacios'),
    ],
    touched: false,
    error: null,
  } as FieldValidation,
  secondSurname: {
    value: '',
    rules: [
      validationRules.maxLength(50, 'No puede exceder 50 caracteres'),
      validationRules.lettersAndSpaces('Solo se permiten letras y espacios'),
    ],
    touched: false,
    error: null,
  } as FieldValidation,
  homeCity: {
    value: '',
    rules: [
      validationRules.required('La ciudad es requerida'),
    ],
    touched: false,
    error: null,
  } as FieldValidation,
  email: {
    value: '',
    rules: [
      validationRules.required('El email es requerido'),
      validationRules.email('Por favor ingresa un email válido'),
      validationRules.maxLength(100, 'El email no puede exceder 100 caracteres'),
    ],
    touched: false,
    error: null,
  } as FieldValidation,
  mobileNumber: {
    value: '+57',
    rules: [
      validationRules.required('El teléfono móvil es requerido'),
      validationRules.phone('Por favor ingresa un teléfono válido'),
    ],
    touched: false,
    error: null,
  } as FieldValidation,
})

onMounted(async () => {
  loadingCities.value = true
  loadingIdTypes.value = true

  try {
    const [citiesData, idTypesData] = await Promise.all([
      getCities(),
      getIdTypes(),
    ])
    
    cities.value = citiesData
    idTypes.value = idTypesData

    if (cities.value.length === 0) {
      notifications.warning('No se pudieron cargar las ciudades. Por favor, verifica la conexión con el backend.')
    }
  } catch (error) {
    notifications.error('Error al cargar los catálogos')
    if (import.meta.env.DEV) {
      console.error('Error cargando catálogos:', error)
    }
  } finally {
    loadingCities.value = false
    loadingIdTypes.value = false
  }
})

const handleInput = (
  fieldName: 'idType' | 'idNumber' | 'firstName' | 'secondName' | 'firstSurname' | 'secondSurname' | 'homeCity' | 'email' | 'mobileNumber'
) => {
  if (fieldsState.value[fieldName].touched) {
    validateField(fieldName)
  }
}

const handleInputNumeric = (fieldName: 'idNumber' | 'mobileNumber') => {
  const numericValue = fieldsState.value[fieldName].value.replace(/\D/g, '')
  fieldsState.value[fieldName].value = numericValue
  
  if (fieldsState.value[fieldName].touched) {
    validateField(fieldName)
  }
}

const handlePhoneInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value
  
  if (!value.startsWith('+57')) {
    const numbersOnly = value.replace(/\D/g, '')
    if (numbersOnly) {
      value = '+57' + numbersOnly
    } else {
      value = '+57'
    }
  } else {
    const prefix = '+57'
    const numbersOnly = value.replace(/\D/g, '').substring(2)
    value = prefix + numbersOnly
  }
  
  if (value.length > 13) {
    value = value.substring(0, 13)
  }
  
  fieldsState.value.mobileNumber.value = value
  
  if (fieldsState.value.mobileNumber.touched) {
    validateField('mobileNumber')
  }
}

const handlePhoneFocus = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value
  
  if (!value.startsWith('+57')) {
    const numbersOnly = value.replace(/\D/g, '')
    if (numbersOnly) {
      value = '+57' + numbersOnly
    } else {
      value = '+57'
    }
    fieldsState.value.mobileNumber.value = value
    setTimeout(() => {
      input.setSelectionRange(value.length, value.length)
    }, 0)
  }
}

const handlePhoneKeydown = (event: KeyboardEvent) => {
  const input = event.target as HTMLInputElement
  const cursorPosition = input.selectionStart || 0
  const selectionEnd = input.selectionEnd || 0
  
  if (['Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter'].includes(event.key)) {
    return
  }
  
  if (event.ctrlKey || event.metaKey) {
    return
  }
  
  if (event.key === 'Backspace') {
    if (cursorPosition <= 3) {
      event.preventDefault()
      return
    }
    if (selectionEnd < cursorPosition && selectionEnd <= 3) {
      event.preventDefault()
      return
    }
  }
  
  if (event.key === 'Delete') {
    if (cursorPosition < 3) {
      event.preventDefault()
      return
    }
  }
  
  if (cursorPosition < 3) {
    event.preventDefault()
  } else {
    const char = event.key
    if (!/[0-9]/.test(char)) {
      event.preventDefault()
    }
  }
}

const handleInputLetters = (fieldName: 'firstName' | 'secondName' | 'firstSurname' | 'secondSurname') => {
  const lettersValue = fieldsState.value[fieldName].value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']/g, '')
  fieldsState.value[fieldName].value = lettersValue
  
  if (fieldsState.value[fieldName].touched) {
    validateField(fieldName)
  }
}

const onlyNumbers = (event: KeyboardEvent) => {
  const char = String.fromCharCode(event.which)
  if (!/[0-9]/.test(char)) {
    event.preventDefault()
  }
}

const onlyLetters = (event: KeyboardEvent) => {
  const char = String.fromCharCode(event.which)
  if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']/.test(char) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.preventDefault()
  }
}

const submitForm = async () => {
  if (!validateAll()) {
    notifications.error('Por favor corrige los errores en el formulario')
    return
  }

  loading.value = true
  console.log('🚀 Iniciando registro de usuario...')

  try {
    if (!fieldsState.value) {
      throw new Error('El estado del formulario no está disponible')
    }
    
    const fields = fieldsState.value
    
    if (!fields.idType || !fields.idNumber || !fields.firstName || 
        !fields.firstSurname || !fields.homeCity || !fields.email || !fields.mobileNumber) {
      console.error('Campos faltantes en fieldsState:', fields)
      throw new Error('Error en la estructura del formulario. Por favor recarga la página.')
    }
    
    const userData = {
      idType: fields.idType.value,
      idNumber: fields.idNumber.value.trim(),
      firstName: fields.firstName.value.trim(),
      secondName: fields.secondName?.value?.trim() || undefined,
      firstSurname: fields.firstSurname.value.trim(),
      secondSurname: fields.secondSurname?.value?.trim() || undefined,
      homeCity: fields.homeCity.value,
      email: fields.email.value.trim().toLowerCase(),
      mobileNumber: fields.mobileNumber.value.trim(),
    }

    const response = await api.post('/v1/users', userData)
    
    // Guardar el número de teléfono registrado
    registeredMobileNumber.value = userData.mobileNumber
    
    notifications.success('Usuario registrado exitosamente. Se ha enviado un código de confirmación por SMS.')
    
    // Mostrar el formulario de confirmación
    showConfirmForm.value = true
    
    if (import.meta.env.DEV) {
      console.log('Registro exitoso:', response.data)
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 
                        err.message || 
                        'Error al registrar el usuario. Por favor intenta nuevamente.'
    notifications.error(errorMessage)
  } finally {
    loading.value = false
  }
}

const handleMobileConfirmed = () => {
  // Cuando se confirma el número, volver al formulario de registro
  showConfirmForm.value = false
  registeredMobileNumber.value = null
  reset()
  fieldsState.value.mobileNumber.value = '+57'
  notifications.success('El número de celular ha sido confirmado exitosamente. Puedes registrar otro usuario si lo deseas.')
}

const handleConfirmError = (errorMessage: string) => {
  // Los errores ya se manejan en el componente, solo logueamos si es necesario
  if (import.meta.env.DEV) {
    console.error('Error al confirmar número:', errorMessage)
  }
}
</script>

<style scoped>
.form-select:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}
</style>
