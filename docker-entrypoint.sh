#!/bin/sh

# Script para iniciar tanto o servidor Socket.io quanto o Next.js

echo "🚀 Iniciando Planning Poker..."
echo "🔧 Container IP: $(hostname -i)"
echo "🔧 Hostname: $(hostname)"

# Iniciar servidor Socket.io em background
echo "📡 Iniciando servidor Socket.io na porta 3001..."
node server.js &
SOCKET_PID=$!

# Aguardar um momento para o Socket.io iniciar
sleep 3

# Verificar se Socket.io está rodando
if kill -0 $SOCKET_PID 2>/dev/null; then
    echo "✅ Socket.io iniciado com sucesso (PID: $SOCKET_PID)"
else
    echo "❌ Falha ao iniciar Socket.io"
    exit 1
fi

# Iniciar Next.js com bind em todas as interfaces
echo "🎨 Iniciando aplicação Next.js na porta 3000..."
echo "🔧 Comando: npx next start -H 0.0.0.0 -p 3000"
npx next start -H 0.0.0.0 -p 3000 &
NEXT_PID=$!

echo "✅ Next.js iniciado (PID: $NEXT_PID)"
echo "🌐 Aplicação disponível em:"
echo "   - http://localhost:3000"
echo "   - http://$(hostname -i):3000"

# Manter o container rodando
wait