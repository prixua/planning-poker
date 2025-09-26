# Planning Poker - Makefile

# Variáveis
DOCKER_IMAGE = planning-poker
DOCKER_TAG = latest
K8S_NAMESPACE = default

# Docker Commands
.PHONY: docker-build docker-run docker-stop docker-clean

docker-build:
	@echo "🐳 Construindo imagem Docker..."
	docker build -t $(DOCKER_IMAGE):$(DOCKER_TAG) .

docker-run:
	@echo "🚀 Executando container Docker..."
	docker run -d -p 3000:3000 -p 3001:3001 --name planning-poker-container $(DOCKER_IMAGE):$(DOCKER_TAG)

docker-stop:
	@echo "⏹️ Parando container Docker..."
	docker stop planning-poker-container || true
	docker rm planning-poker-container || true

docker-clean:
	@echo "🧹 Limpando imagens Docker..."
	docker rmi $(DOCKER_IMAGE):$(DOCKER_TAG) || true

# Docker Compose Commands
.PHONY: compose-up compose-down compose-build

compose-up:
	@echo "🐳 Iniciando com Docker Compose..."
	docker-compose up -d

compose-down:
	@echo "⏹️ Parando Docker Compose..."
	docker-compose down

compose-build:
	@echo "🔨 Construindo com Docker Compose..."
	docker-compose up --build -d

# Kubernetes Commands
.PHONY: k8s-deploy k8s-delete k8s-dev k8s-dev-delete

k8s-deploy:
	@echo "☸️ Fazendo deploy no Kubernetes..."
	kubectl apply -f k8s-deployment.yaml

k8s-delete:
	@echo "🗑️ Removendo do Kubernetes..."
	kubectl delete -f k8s-deployment.yaml

k8s-dev:
	@echo "🛠️ Deploy de desenvolvimento no Kubernetes..."
	kubectl apply -f k8s-dev.yaml
	@echo "✅ Acesse em: http://localhost:30000"

k8s-dev-delete:
	@echo "🗑️ Removendo desenvolvimento do Kubernetes..."
	kubectl delete -f k8s-dev.yaml

# Development Commands  
.PHONY: dev install build

dev:
	@echo "🔧 Executando em modo desenvolvimento..."
	npm run dev:full

install:
	@echo "📦 Instalando dependências..."
	npm install

build:
	@echo "🔨 Construindo aplicação..."
	npm run build

# Help
.PHONY: help

help:
	@echo "📋 Comandos disponíveis:"
	@echo "  Docker:"
	@echo "    make docker-build     - Constrói a imagem Docker"
	@echo "    make docker-run       - Executa o container"
	@echo "    make docker-stop      - Para o container"
	@echo "    make compose-up       - Inicia com docker-compose"
	@echo "    make compose-down     - Para docker-compose"
	@echo ""
	@echo "  Kubernetes:"
	@echo "    make k8s-deploy       - Deploy em produção"
	@echo "    make k8s-dev          - Deploy desenvolvimento (NodePort)"
	@echo "    make k8s-delete       - Remove do cluster"
	@echo ""
	@echo "  Desenvolvimento:"
	@echo "    make dev              - Executa localmente"
	@echo "    make install          - Instala dependências"
	@echo "    make build            - Constrói aplicação"