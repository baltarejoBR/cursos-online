#!/bin/bash
# Script de deploy - CursosOnline
# Rode este script no Terminal do Mac

echo "========================================="
echo "  Deploy CursosOnline - GitHub + Vercel"
echo "========================================="
echo ""

# Verificar se git está instalado
if ! command -v git &> /dev/null; then
    echo "Git nao encontrado. Instalando..."
    xcode-select --install
    echo "Depois de instalar o Xcode tools, rode este script novamente."
    exit 1
fi

# Verificar se Node está instalado
if ! command -v node &> /dev/null; then
    echo "Node.js nao encontrado!"
    echo "Baixe e instale em: https://nodejs.org"
    echo "Depois rode este script novamente."
    exit 1
fi

echo "1/4 - Inicializando repositorio Git..."
cd "$(dirname "$0")"
git init
git branch -M main

echo ""
echo "2/4 - Adicionando arquivos..."
git add -A
git commit -m "Plataforma de cursos online com Supabase Auth"

echo ""
echo "3/4 - Enviando para o GitHub..."
git remote add origin https://github.com/baltarejoBR/cursos-online.git 2>/dev/null || git remote set-url origin https://github.com/baltarejoBR/cursos-online.git
git push -u origin main --force

echo ""
echo "4/4 - Instalando dependencias locais..."
npm install

echo ""
echo "========================================="
echo "  PRONTO! Codigo enviado para o GitHub"
echo "========================================="
echo ""
echo "Proximo passo: volte para o Claude que"
echo "ele vai conectar a Vercel ao GitHub e"
echo "configurar o dominio metodocorpolimpo.com.br"
echo ""
echo "Para testar localmente: npm run dev"
echo "Depois acesse: http://localhost:3000"
echo ""
