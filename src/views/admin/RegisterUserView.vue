<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <div class="card shadow-sm p-4">
          <h2 class="mb-4 text-center">Registro de Nuevo Usuario</h2>
          
          <LoadingSpinner v-if="loading" message="Registrando usuario..." />
          
          <form v-else @submit.prevent="submitForm">
            <!-- Tipo de ID y Número de Identificación -->
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
            
            <!-- Nombres -->
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
            
            <!-- Apellidos -->
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
            
            <!-- Ciudad y Email -->
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
            
            <!-- Teléfono -->
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
                  @input="handleInput('mobileNumber')"
                  @keypress="onlyNumbers"
                  maxlength="15"
                  placeholder="Solo números"
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
        </div>
        <div class="mt-3">
          <router-link :to="{ name: 'home' }" class="btn btn-link">Volver al Home</router-link>
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
import { getCities, getIdTypes, type City, type IdType } from '../../services/catalog.service'

const notifications = useNotificationsStore()
const loading = ref(false)
const loadingCities = ref(false)
const loadingIdTypes = ref(false)
const cities = ref<City[]>([])
const idTypes = ref<IdType[]>([])

// Configuración de campos con validación
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
    value: '',
    rules: [
      validationRules.required('El teléfono móvil es requerido'),
      validationRules.phone('Por favor ingresa un teléfono válido'),
    ],
    touched: false,
    error: null,
  } as FieldValidation,
})

// Cargar catálogos al montar el componente
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

// Funciones helper para validación en tiempo real
const handleInput = (
  fieldName: 'idType' | 'idNumber' | 'firstName' | 'secondName' | 'firstSurname' | 'secondSurname' | 'homeCity' | 'email' | 'mobileNumber'
) => {
  if (fieldsState.value[fieldName].touched) {
    validateField(fieldName)
  }
}

// Solo permite números en el input
const handleInputNumeric = (fieldName: 'idNumber' | 'mobileNumber') => {
  // Remover caracteres no numéricos
  const numericValue = fieldsState.value[fieldName].value.replace(/\D/g, '')
  fieldsState.value[fieldName].value = numericValue
  
  if (fieldsState.value[fieldName].touched) {
    validateField(fieldName)
  }
}

// Solo permite letras en el input
const handleInputLetters = (fieldName: 'firstName' | 'secondName' | 'firstSurname' | 'secondSurname') => {
  // Remover caracteres que no sean letras, espacios, guiones o apóstrofes
  const lettersValue = fieldsState.value[fieldName].value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']/g, '')
  fieldsState.value[fieldName].value = lettersValue
  
  if (fieldsState.value[fieldName].touched) {
    validateField(fieldName)
  }
}

// Prevenir entrada de caracteres no permitidos
const onlyNumbers = (event: KeyboardEvent) => {
  const char = String.fromCharCode(event.which)
  if (!/[0-9]/.test(char)) {
    event.preventDefault()
  }
}

const onlyLetters = (event: KeyboardEvent) => {
  const char = String.fromCharCode(event.which)
  // Permitir letras, espacios, backspace, delete, etc.
  if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']/.test(char) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.preventDefault()
  }
}

const submitForm = async () => {
  // Validar todos los campos
  if (!validateAll()) {
    notifications.error('Por favor corrige los errores en el formulario')
    return
  }

  loading.value = true

  try {
    // Preparar datos del formulario
    const userData = {
      idType: fieldsState.idType.value,
      idNumber: fieldsState.idNumber.value.trim(),
      firstName: fieldsState.firstName.value.trim(),
      secondName: fieldsState.secondName.value.trim() || undefined,
      firstSurname: fieldsState.firstSurname.value.trim(),
      secondSurname: fieldsState.secondSurname.value.trim() || undefined,
      homeCity: fieldsState.homeCity.value.trim(),
      email: fieldsState.email.value.trim().toLowerCase(),
      mobileNumber: fieldsState.mobileNumber.value.trim(),
    }

    const response = await api.post('/api/v1/users', userData)
    
    notifications.success('Usuario registrado exitosamente')
    
    // Limpiar formulario después de registro exitoso
    reset()
    
    // Solo loggear en desarrollo
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
</script>

<style scoped>
.form-select:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}
</style>
