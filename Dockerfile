# Use Node.js 18 Alpine
FROM node:18-alpine

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm ci

# Copiar código fonte
COPY . .

# Construir aplicação
RUN npm run build

# Expor portas
EXPOSE 3000 3001

# Script de inicialização
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]