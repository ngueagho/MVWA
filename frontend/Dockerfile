FROM node:18-alpine

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du code source
COPY . .

# Port d'exposition
EXPOSE 3000

# Variables d'environnement
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Commande de développement
CMD ["npm", "run", "dev"]