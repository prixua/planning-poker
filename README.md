# Planning Poker

Sistema de Planning Poker para equipes ágeis com interface visual e comunicação em tempo real.

## Funcionalidades

- ✅ **Criação de Salas**: Primeiro usuário cria uma sala com código de 4 dígitos
- ✅ **Tipos de Usuário**: Votante (pode votar) e Espectador (apenas observa)
- ✅ **Cards de Fibonacci**: Sequência completa para votação (0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89)
- ✅ **Cards Especiais**: Café ☕ e Interrogação ❓
- ✅ **Votação Secreta**: Votos ficam ocultos até serem revelados
- ✅ **Indicadores Visuais**: Mostra quem já votou sem revelar o voto
- ✅ **Revelação de Votos**: Botão para revelar todos os votos simultaneamente
- ✅ **Avatares Diferenciados**: Espectadores têm visual diferente dos votantes
- ✅ **Tempo Real**: Comunicação via Socket.io
- ✅ **Compartilhamento**: Link da sala pode ser compartilhado

## Como Executar

### Opção 1: Com Docker (Recomendado) 🐳

**Usando Docker Compose:**
```bash
docker-compose up --build
```

**Ou usando Docker diretamente:**
```bash
# Construir imagem
docker build -t planning-poker .

# Executar container
docker run -p 3000:3000 -p 3001:3001 planning-poker
```

**Acesse:** `http://localhost:3000`

### Opção 2: Instalação Local

### Pré-requisitos
- Node.js 18+ instalado
- NPM ou Yarn

### Instalação

1. Instale as dependências:
```bash
npm install
```

### Executar o Sistema Completo

Para executar tanto o frontend quanto o servidor Socket.io:

```bash
npm run dev:full
```

Isso iniciará:
- Frontend Next.js em `http://localhost:3000`
- Servidor Socket.io em `http://localhost:3001`

### Executar Separadamente

**Frontend apenas:**
```bash
npm run dev
```

**Servidor Socket.io apenas:**
```bash
npm run socket
```

## Como Usar

1. **Criar uma Sala:**
   - Acesse `http://localhost:3000`
   - Digite seu nome
   - Escolha se é Votante ou Espectador
   - Clique em "Criar Nova Sala"
   - Um código de 4 dígitos será gerado e aparecerá na URL

2. **Entrar em uma Sala:**
   - Acesse `http://localhost:3000`
   - Digite seu nome
   - Escolha se é Votante ou Espectador
   - Digite o código da sala (4 dígitos)
   - Clique em "Entrar na Sala"

3. **Votar:**
   - Apenas votantes podem votar
   - Clique em um card de Fibonacci (0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89)
   - Ou clique nos cards especiais: ☕ (café) ou ❓ (interrogação)
   - Seu voto ficará oculto para outros usuários

4. **Revelar Votos:**
   - Quando todos os votantes tiverem votado, clique em "Revelar Votos"
   - Todos os votos serão exibidos simultaneamente

5. **Nova Votação:**
   - Clique em "Nova Votação" para resetar e começar uma nova rodada

## Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx                 # Página inicial
│   ├── room/[roomId]/page.tsx   # Página da sala
│   └── api/socket/route.ts      # API routes (não usada ativamente)
├── components/
│   ├── VotingCard.tsx           # Componente dos cards de votação
│   └── UserAvatar.tsx           # Componente do avatar do usuário
└── types/
    └── index.ts                 # Definições TypeScript
server.js                        # Servidor Socket.io
```

## Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Socket.io (Node.js)
- **Comunicação**: WebSockets para tempo real
- **Estilização**: Tailwind CSS

## Deployment com Docker 🚀

### Publicar no Docker Hub

```bash
# Construir e taguear
docker build -t seu-usuario/planning-poker:latest .

# Publicar
docker push seu-usuario/planning-poker:latest

# Usar em qualquer lugar
docker run -d -p 3000:3000 -p 3001:3001 seu-usuario/planning-poker:latest
```

### Deploy em Servidores

**VPS/Cloud:**
```bash
# No servidor
git clone https://github.com/seu-usuario/planning-poker.git
cd planning-poker
docker-compose up -d
```

**Kubernetes:**
```bash
# Aplicar configuração do Kubernetes
kubectl apply -f k8s-deployment.yaml

# Verificar status
kubectl get pods
kubectl get services

# Obter URL externa (se LoadBalancer)
kubectl get services planning-poker-service
```

