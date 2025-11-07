// src/main.ts

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createAuth0 } from '@auth0/auth0-vue'
import { createPinia } from 'pinia'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

const app = createApp(App)

// Pinia
const pinia = createPinia()
app.use(pinia)

// Auth0 configuration: se usan variables de entorno si existen, sino los valores proporcionados
const AUTH0_DOMAIN = (import.meta.env.VITE_AUTH0_DOMAIN as string) || 'dev-l7bs34cafn0six34.us.auth0.com'
const AUTH0_CLIENT_ID = (import.meta.env.VITE_AUTH0_CLIENT_ID as string) || 'EnUXsuUKJ3iQdAwFsSjAG9uNSoQLd5bY'
const AUTH0_AUDIENCE = (import.meta.env.VITE_AUTH0_AUDIENCE as string) || 'https://ucochallenge-api/'

app.use(router)

app.use(
  createAuth0({
    domain: 'dev-l7bs34cafn0six34.us.auth0.com',
    clientId: 'EnUXsuUKJ3iQdAwFsSjAG9uNSoQLd5bY',
    authorizationParams: {
      redirect_uri: window.location.origin + '/callback',
      audience: 'https://ucochallenge-api/', // ✅ sin slash y consistente
      scope: 'openid profile email',
    },
    cacheLocation: 'localstorage',
    useRefreshTokens: true,
  })
)




app.mount('#app')