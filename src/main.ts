// src/main.ts

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createAuth0 } from '@auth0/auth0-vue'
import { createPinia } from 'pinia'
import { envConfig } from './config/env'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

const app = createApp(App)

// Pinia
const pinia = createPinia()
app.use(pinia)

// Auth0 configuration: usa variables de entorno validadas
// Las variables se validan al importar envConfig
app.use(router)

app.use(
  createAuth0({
    domain: envConfig.auth0Domain,
    clientId: envConfig.auth0ClientId,
    authorizationParams: {
      redirect_uri: window.location.origin + '/callback',
      audience: envConfig.auth0Audience,
      scope: 'openid profile email',
    },
    cacheLocation: 'localstorage',
    useRefreshTokens: true,
  })
)

app.mount('#app')