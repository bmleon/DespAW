# 1. Usamos una imagen oficial de Node.js (versión 20, ligera)
FROM node:20-alpine

# 2. Le decimos a Docker que trabaje dentro de la carpeta /app
WORKDIR /app

# 3. Copiamos solo los archivos de dependencias primero (para aprovechar la caché)
COPY package.json package-lock.json ./

# 4. Instalamos las dependencias de Node
RUN npm install

# 5. Copiamos el resto de tu código fuente (excepto lo que esté en .dockerignore)
COPY . .

# 6. Compilamos el proyecto Nuxt para producción
RUN npm run build

# 7. Exponemos el puerto 3000 (el estándar de Nuxt)
EXPOSE 3000

# 8. Comando para encender el servidor de Nuxt en producción
CMD ["node", ".output/server/index.mjs"]