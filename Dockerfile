# Dockerfile para Frontend Vue
# Multi-stage build para optimizar el tamaño de la imagen

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Build de la aplicación
RUN npm run build

# Stage 2: Production (Nginx para servir archivos estáticos)
FROM nginx:alpine

# Copiar archivos construidos desde el builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx (opcional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]

