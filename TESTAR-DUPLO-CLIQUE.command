#!/bin/bash
# =============================================
# TESTAR CursosOnline - Duplo clique para rodar
# =============================================

echo ""
echo "========================================="
echo "  Teste Local - Método Corpo Limpo"
echo "========================================="
echo ""

# Navegar para a pasta do projeto
cd "$(dirname "$0")"

# Verificar se Node está instalado
if ! command -v node &> /dev/null; then
    echo "Node.js nao encontrado!"
    echo "Instale em: https://nodejs.org"
    echo ""
    echo "Pressione qualquer tecla para fechar..."
    read -n 1
    exit 1
fi

echo "Node.js: $(node --version)"
echo ""

# Instalar dependências
echo "1/2 - Instalando dependencias..."
npm install
echo ""

# Rodar servidor
echo "2/2 - Iniciando servidor..."
echo ""
echo "========================================="
echo "  Servidor rodando!"
echo "  Acesse: http://localhost:3000"
echo "  Setup:  http://localhost:3000/setup"
echo "  Admin:  http://localhost:3000/admin"
echo "  Planos: http://localhost:3000/planos"
echo "========================================="
echo ""
echo "Pressione Ctrl+C para parar o servidor"
echo ""

# Abrir no navegador automaticamente
sleep 2 && open http://localhost:3000 &

npm run dev
