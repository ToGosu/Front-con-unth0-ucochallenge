import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    // Configuración opcional de HTTPS para el frontend
    // Descomenta si quieres que el frontend también corra en HTTPS
    // https: {
    //   // Usar certificados autofirmados para desarrollo
    //   key: fs.readFileSync(path.resolve(__dirname, './certs/backend.key')),
    //   cert: fs.readFileSync(path.resolve(__dirname, './certs/backend.crt')),
    // },
    port: 5173,
    // Proxy removido: ahora las peticiones van directamente a https://localhost:8443/uco-challenge
    // El backend ya está configurado para aceptar CORS desde los orígenes permitidos
  },
})
