# 🎓 CursosOnline - Guia de Instalação e Deploy

## O que foi criado

Uma plataforma de cursos online completa com:
- **Página inicial** com cursos gratuitos e premium
- **Cadastro e Login** com email e senha (via Supabase Auth)
- **Área do Aluno** protegida por senha (rota /minha-area)
- **Sistema de matrículas** em cursos
- **Controle de acesso** — aulas bloqueadas para quem não tem plano premium
- **Banco de dados** no Supabase (projeto: CursosOnline, região: São Paulo)

## Pré-requisitos

- Node.js 18+ instalado (https://nodejs.org)
- Conta no GitHub (https://github.com)
- Conta na Vercel (https://vercel.com) — login com GitHub

## Passo 1: Instalar dependências

Abra o terminal na pasta `cursos-online` e rode:

```bash
npm install
```

## Passo 2: Testar localmente

```bash
npm run dev
```

Acesse http://localhost:3000 no navegador.

## Passo 3: Configurar o Supabase

1. Acesse https://supabase.com/dashboard
2. Abra o projeto **CursosOnline**
3. Vá em **Authentication → URL Configuration**
4. Em **Site URL**, coloque: `http://localhost:3000` (depois trocar pela URL da Vercel)
5. Em **Redirect URLs**, adicione: `http://localhost:3000/auth/callback`

## Passo 4: Subir para o GitHub

```bash
cd cursos-online
git init
git add .
git commit -m "Plataforma de cursos online"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/cursos-online.git
git push -u origin main
```

## Passo 5: Deploy na Vercel

1. Acesse https://vercel.com/new
2. Importe o repositório `cursos-online`
3. Em **Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://tdrzigpkarqrjhnssqlc.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (a chave que está no .env.local)
4. Clique **Deploy**

## Passo 6: Atualizar URLs no Supabase

Depois do deploy, copie a URL da Vercel (ex: `https://cursos-online.vercel.app`) e:

1. No Supabase → Authentication → URL Configuration
2. Atualize **Site URL** para sua URL da Vercel
3. Adicione `https://SUA-URL.vercel.app/auth/callback` em **Redirect URLs**

## Estrutura de acesso

| Conteúdo | Visitante | Logado (Grátis) | Logado (Premium) |
|----------|-----------|-----------------|-------------------|
| Ver cursos | ✅ | ✅ | ✅ |
| Aulas de cursos gratuitos | ❌ | ✅ | ✅ |
| Preview de cursos pagos | ✅ | ✅ | ✅ |
| Aulas de cursos pagos | ❌ | ❌ | ✅ |
| Área do Aluno | ❌ | ✅ | ✅ |

## Como adicionar cursos

No Supabase → SQL Editor, rode:

```sql
INSERT INTO courses (title, description, is_free, category)
VALUES ('Nome do Curso', 'Descrição do curso', false, 'Categoria');
```

Para adicionar aulas:

```sql
INSERT INTO lessons (course_id, title, content, order_index, is_preview)
VALUES ('ID-DO-CURSO', 'Nome da Aula', 'Conteúdo...', 1, false);
```
