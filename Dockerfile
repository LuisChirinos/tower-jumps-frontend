FROM node:18-alpine

# Cambia el directorio de trabajo a lo que prefieras
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todo el resto de tu código
COPY . .

# Compila el proyecto Next.js
RUN npm run build


# Comando de arranque: producirá "next start -p $PORT"
CMD ["npm", "run", "start"]
