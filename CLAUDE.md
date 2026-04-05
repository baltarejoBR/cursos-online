# Metodo Corpo Limpo - Plataforma de Cursos

## Stack
- Next.js 14.2 (App Router) + React 18.3
- Supabase (auth + PostgreSQL)
- Stripe (pagamentos)
- Vercel (deploy)
- n8n (automacao Telegram - ainda nao configurado)

## Estrutura
```
src/
  app/
    page.js              # Home
    login/page.js        # Login (email + Google OAuth)
    cadastro/page.js     # Registro
    planos/page.js       # Catalogo de produtos com filtros
    produto/[slug]/      # Pagina do produto + botao comprar
    cursos/[id]/         # Detalhe do curso + player de conteudo
    minha-area/page.js   # Dashboard do usuario (protegido)
    admin/page.js        # Painel admin (protegido, so baltarejo@gmail.com)
    pagamento/sucesso/   # Confirmacao pos-pagamento
    auth/callback/       # OAuth callback
    api/
      checkout/          # Cria sessao Stripe (POST: {productId} ou {planType})
      billing-portal/    # Portal Stripe do cliente
      webhooks/stripe/   # Webhook Stripe (5 eventos)
      admin/subscribers/ # Stats admin
      setup/check/       # Verificacao de config
      conteudo/[slug]/   # Conteudo HTML protegido (premium)
  lib/
    products.js          # Catalogo: PRODUCTS[], CATEGORIES{}
    stripe.js            # Cliente Stripe + PLANS (legado mensal/anual)
    supabase-admin.js    # Cliente admin (service_role)
    supabase-browser.js  # Cliente browser
    supabase-server.js   # Cliente server
  components/
    Header.js            # Nav + auth state
    GoogleAuthButton.js  # Botao Google OAuth
```

## Produtos (src/lib/products.js)
| ID | Tipo | Preco | Modo Stripe |
|---|---|---|---|
| curso-cds-completo | one_time | R$297 | payment |
| curso-cds-humanos | one_time | R$197 | payment |
| curso-cds-animais | one_time | R$197 | payment |
| curso-teamor-telegram | subscription | R$97/mes | subscription |
| livro-completo | one_time | R$97 | payment |
| livro-animais | one_time | R$67 | payment |
| consultoria | one_time | R$197 | payment |
| loja-produtos | external | - | redirect (URL nao configurada) |

## Planos legado (src/lib/stripe.js)
- monthly: R$49,90/mes
- yearly: R$399/ano

## Fluxo de pagamento
1. Usuario clica "Comprar" em /produto/[slug]
2. POST /api/checkout com {productId}
3. Cria/busca customer Stripe, cria Checkout Session
4. Redireciona para Stripe
5. Webhook recebe evento e atualiza Supabase (subscription, profile, payments)
6. Notifica n8n (se configurado)

## Tabelas Supabase
- profiles (id, plan, stripe_customer_id, telegram_username, full_name)
- courses, lessons, enrollments
- subscriptions (stripe_subscription_id, status, period)
- payments (stripe_payment_intent_id, amount, status)

## Env vars necessarias (.env.local)
- NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
- NEXT_PUBLIC_SITE_URL
- N8N_WEBHOOK_URL, N8N_WEBHOOK_SECRET (opcionais)

## Deploy
- Repo: github.com/baltarejoBR/cursos-online
- Scripts: deploy.sh, DEPLOY-DUPLO-CLIQUE.command
- Dominio: metodocorpolimpo.com.br

## Testes Stripe
- Chaves: modo test (pk_test_, sk_test_)
- Cartao teste: 4242 4242 4242 4242 (qualquer data futura, qualquer CVC)
- Webhook secret: placeholder (whsec_SERA_GERADO_AO_CONFIGURAR_WEBHOOK)
- Webhook precisa ser configurado no Stripe Dashboard ou via Stripe CLI
