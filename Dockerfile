# Dockerfile para Pamela backend
FROM node:22-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el backend
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "start"]
