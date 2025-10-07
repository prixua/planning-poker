# Use Node.js 18 Alpine
FROM node:18-alpine

WORKDIR /app

# Instalar dependências (incluindo devDependencies para build)
COPY package*.json ./
RUN npm ci

# Copiar código fonte
COPY . .

# Construir aplicação
RUN npm run build

# Instalar apenas dependências de produção + TypeScript (necessário para next.config)
RUN npm ci --only=production && npm install typescript && npm cache clean --force

# Verificar se o arquivo servidor existe
RUN ls -la server-integrated.js

# Expor apenas a porta do Next.js
EXPOSE 3000

# Iniciar diretamente o servidor integrado
CMD ["node", "server-integrated.js"]