# Planning Poker 🎯

Sistema de Planning Poker para equipes ágeis com interface visual, comunicação em tempo real e estatísticas de votação.

## ✨ Funcionalidades

### 🏠 **Sistema de Salas**
- ✅ **Criação de Salas**: Código único de 4 dígitos
- ✅ **Compartilhamento**: Link direto para entrada na sala
- ✅ **Tipos de Usuário**: Votante (participa) e Espectador (observa)

### 🗳️ **Sistema de Votação**
- ✅ **Cards Fibonacci**: 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89
- ✅ **Cards Especiais**: ☕ Café e ❓ Interrogação
- ✅ **Votação Secreta**: Votos ocultos até revelação
- ✅ **Indicadores Visuais**: Status de votação em tempo real
- ✅ **Revelação Flexível**: Pode revelar mesmo sem todos votarem

### 📊 **Estatísticas e Resultados**
- ✅ **Média Automática**: Cálculo com 1 casa decimal
- ✅ **Estatísticas Completas**: Menor, maior e detecção de consenso
- ✅ **Visual Intuitivo**: Cards coloridos para fácil interpretação
- ✅ **Contadores Dinâmicos**: "X de Y votaram" em tempo real

### 🚀 **Experiência do Usuário**
- ✅ **Loading States**: Feedback visual durante operações
- ✅ **Interface Responsiva**: Funciona em mobile e desktop
- ✅ **Socket.io Integrado**: Comunicação unificada na porta 3000
- ✅ **Tempo Real**: Sincronização instantânea entre usuários

## 🚀 Como Executar

### Opção 1: Docker (Recomendado) 🐳

**Usando Docker Hub:**
```bash
# Executar direto do Docker Hub
docker run -d -p 3000:3000 prixua/planning-poker:latest

# Acessar em: http://localhost:3000
```

**Build local:**
```bash
# Construir imagem
docker build -t planning-poker .

# Executar container
docker run -d -p 3000:3000 planning-poker

# Acessar em: http://localhost:3000
```

### Opção 2: Desenvolvimento Local

**Pré-requisitos:**
- Node.js 18+ instalado
- NPM instalado

**Instalação:**
```bash
# Clonar repositório
git clone https://github.com/prixua/planning-poker.git
cd planning-poker

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev:integrated

# Acessar em: http://localhost:3000
```

## ☸️ Deploy com Kubernetes

### Aplicar no Cluster

```bash
# Apply do deployment e service
kubectl apply -f k8s-dev.yaml

# Verificar status
kubectl get pods
kubectl get services

# Ver logs
kubectl logs deployment/planning-poker-dev
```

### Acessar a Aplicação

**Via NodePort:**
```bash
# Descobrir IP do node
kubectl get nodes -o wide

# Acessar: http://[NODE-IP]:30000
```

**Via Port-Forward (desenvolvimento):**
```bash
# Port-forward para localhost
kubectl port-forward service/planning-poker-service-dev 3000:3000

# Acessar: http://localhost:3000
```

### Configuração do Kubernetes

O arquivo `k8s-dev.yaml` inclui:
- **Deployment**: Pod com aplicação integrada
- **Service**: NodePort na porta 30000
- **Resources**: Limites de CPU e memória
- **Health Checks**: Readiness e liveness probes

## 📖 Como Usar

### 1. **Criar uma Sala**
- Acesse a aplicação
- Digite seu nome
- Escolha "Votante" ou "Espectador"
- Clique em "Criar Nova Sala"
- Compartilhe o código ou link gerado

### 2. **Entrar em uma Sala**
- Digite o código de 4 dígitos
- Ou acesse o link compartilhado
- Escolha seu tipo de participação

### 3. **Votar (apenas Votantes)**
- Clique em um card de Fibonacci
- Ou use cards especiais (☕, ❓)
- Voto fica oculto até revelação

### 4. **Revelar Resultados**
- Clique "Revelar Votos" quando necessário
- Veja estatísticas automáticas:
  - **Média** dos votos numéricos
  - **Menor** e **maior** voto
  - **Consenso** quando todos votam igual

### 5. **Nova Votação**
- Clique "Nova Votação" para resetar
- Inicie nova rodada

## 🏗️ Arquitetura

### **Sistema Integrado**
- **Frontend + Backend**: Uma única porta (3000)
- **Socket.io**: Integrado ao Next.js
- **Comunicação**: WebSockets unificados

### **Estrutura do Projeto**
```
src/
├── app/
│   ├── page.tsx                 # Página inicial
│   ├── room/[roomId]/page.tsx   # Sala de votação
│   └── api/socket/route.ts      # API routes
├── components/
│   ├── VotingCard.tsx           # Cards de votação
│   └── UserAvatar.tsx           # Avatar com status
└── types/
    └── index.ts                 # Tipos TypeScript

server-integrated.js             # Servidor integrado Next.js + Socket.io
k8s-dev.yaml                    # Manifesto Kubernetes
Dockerfile                      # Configuração Docker
```

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js com Socket.io integrado
- **Comunicação**: WebSockets para tempo real
- **Containerização**: Docker
- **Orquestração**: Kubernetes
- **Estilização**: Tailwind CSS responsivo

## 🚢 Deploy em Produção

### **Docker Hub**
```bash
# Build e push
docker build -t seu-usuario/planning-poker:latest .
docker push seu-usuario/planning-poker:latest

# Deploy em qualquer lugar
docker run -d -p 3000:3000 seu-usuario/planning-poker:latest
```

### **Kubernetes em Cloud**
```bash
# Azure AKS / Google GKE / Amazon EKS
kubectl apply -f k8s-deployment.yaml

# Para LoadBalancer externo
kubectl get services planning-poker-service
```

### **VPS/Cloud Server**
```bash
# Via Docker Compose
git clone https://github.com/prixua/planning-poker.git
cd planning-poker
docker-compose up -d
```

## 🔧 Configuração Avançada

### **Variáveis de Ambiente**
```bash
NODE_ENV=production    # Modo de execução
HOSTNAME=0.0.0.0      # Interface de rede
PORT=3000             # Porta da aplicação
```

### **Scripts Disponíveis**
```bash
npm run dev:integrated  # Desenvolvimento com servidor integrado
npm run build          # Build de produção
npm start              # Produção com servidor integrado
npm run lint           # Verificação de código
```

## 📊 Monitoramento

### **Logs do Kubernetes**
```bash
# Logs em tempo real
kubectl logs -f deployment/planning-poker-dev

# Logs anteriores
kubectl logs deployment/planning-poker-dev --previous
```

### **Status da Aplicação**
```bash
# Health check
curl http://localhost:3000/api/health

# Métricas do Kubernetes
kubectl top pods
kubectl describe pod [pod-name]
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'feat: adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ para equipes ágeis**

