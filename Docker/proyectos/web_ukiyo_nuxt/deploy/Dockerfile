# =========================================================
# ETAPA 1: CONSTRUCCIÓN (BUILDER)
# =========================================================
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Copiamos los descriptores de dependencias desde la raíz
COPY package.json package-lock.json ./

# 2. Instalamos todas las dependencias (desarrollo y producción) de forma limpia
RUN npm ci

# 3. Copiamos el resto del código fuente del proyecto a la imagen
COPY . .

# 4. Compilamos Nuxt para producción (esto genera la carpeta optimizada .output)
RUN npm run build

# =========================================================
# ETAPA 2: PRODUCCIÓN (RUNNER)
# =========================================================
FROM node:20-alpine AS runner

WORKDIR /app

# 5. Forzamos variables de entorno seguras y óptimas para producción
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# 6. CLEAN CODE: Copiamos ÚNICAMENTE la carpeta compilada (.output) de la etapa anterior.
# Esto hace que la imagen final sea ligerísima y no contenga código fuente expuesto.
COPY --from=builder /app/.output ./.output

# 7. Exponemos el puerto por el que escucha Nuxt Nitro
EXPOSE 3000

# 8. Arrancamos el servidor de producción optimizado
CMD ["node", ".output/server/index.mjs"]