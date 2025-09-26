#!/bin/bash

echo "🧪 Testando conectividade do container..."

# Testar se as portas estão abertas
echo "🔍 Verificando portas abertas:"
netstat -tlnp 2>/dev/null | grep -E "(3000|3001)" || echo "❌ Nenhuma porta encontrada"

# Testar conectividade HTTP
echo "🌐 Testando conectividade HTTP:"
timeout 5 wget -qO- http://localhost:3000 > /dev/null 2>&1 && echo "✅ Porta 3000 acessível" || echo "❌ Porta 3000 inacessível"
timeout 5 wget -qO- http://localhost:3001 > /dev/null 2>&1 && echo "✅ Porta 3001 acessível" || echo "❌ Porta 3001 inacessível"

# Mostrar informações do container
echo "📋 Info do container:"
echo "   IP: $(hostname -i)"
echo "   Hostname: $(hostname)"

# Manter rodando para debug
echo "🔄 Container em execução... Pressione Ctrl+C para sair"
tail -f /dev/null