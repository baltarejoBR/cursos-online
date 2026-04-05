#!/bin/bash
# =============================================
# DEPLOY CursosOnline - Duplo clique para rodar
# =============================================

echo ""
echo "========================================="
echo "  Deploy CursosOnline - GitHub + Vercel"
echo "========================================="
echo ""

# Navegar para a pasta do projeto
cd "$(dirname "$0")"

# Verificar se git está instalado
if ! command -v git &> /dev/null; then
    echo "Git nao encontrado. Instalando Xcode tools..."
    xcode-select --install
    echo ""
    echo "Depois de instalar, clique duplo neste arquivo novamente."
    echo "Pressione qualquer tecla para fechar..."
    read -n 1
    exit 1
fi

echo "1/3 - Inicializando repositorio Git..."
git init
git branch -M main

echo ""
echo "2/3 - Adicionando arquivos..."
git add -A
git commit -m "Plataforma de cursos online com Supabase Auth"

echo ""
echo "3/3 - Enviando para o GitHub..."
git remote add origin https://github.com/baltarejoBR/cursos-online.git 2>/dev/null || git remote set-url origin https://github.com/baltarejoBR/cursos-online.git
git push -u origin main --force

echo ""
echo "========================================="
echo "  PRONTO! Codigo enviado para o GitHub!"
echo "========================================="
echo ""
echo "Volte para o Claude que ele vai"
echo "finalizar a configuracao do site."
echo ""
echo "Pressione qualquer tecla para fechar..."
read -n 1
