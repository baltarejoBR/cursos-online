# Guia de Configuração do Stripe - Método Corpo Limpo

## 1. Criar conta no Stripe

1. Acesse https://dashboard.stripe.com/register
2. Crie sua conta com seu email
3. Complete a verificação do seu negócio

## 2. Obter as chaves da API

1. No dashboard do Stripe, vá em **Developers > API Keys**
2. Copie a **Publishable key** (começa com `pk_test_`)
3. Copie a **Secret key** (começa com `sk_test_`)
4. Cole essas chaves no arquivo `.env.local`:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_SuaChaveAqui
   STRIPE_SECRET_KEY=sk_test_SuaChaveAqui
   ```

## 3. Configurar o Webhook

Para que os pagamentos sejam processados automaticamente:

1. No Stripe Dashboard, vá em **Developers > Webhooks**
2. Clique em **Add endpoint**
3. URL do endpoint: `https://seusite.com/api/webhooks/stripe`
4. Selecione os seguintes eventos:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Clique em **Add endpoint**
6. Copie o **Signing secret** (começa com `whsec_`)
7. Cole no `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_SeuSecretAqui
   ```

### Para testar localmente:

1. Instale o Stripe CLI: https://stripe.com/docs/stripe-cli
2. Execute: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. Use o webhook secret que o CLI mostrar

## 4. Configurar Supabase Service Role

1. No Supabase Dashboard, vá em **Settings > API**
2. Copie a **service_role key** (ATENÇÃO: esta chave é secreta!)
3. Cole no `.env.local`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...SuaChaveAqui
   ```

## 5. Configurar URL do site

Atualize a URL do site no `.env.local`:
```
NEXT_PUBLIC_SITE_URL=https://metodocorpolimpo.com
```
(Use `http://localhost:3000` para desenvolvimento local)

## 6. Testar pagamentos

O Stripe em modo teste aceita cartões de teste:
- **Cartão válido:** 4242 4242 4242 4242
- **Data:** qualquer data futura
- **CVC:** qualquer 3 dígitos

## 7. Ir para produção

1. Complete a verificação do seu negócio no Stripe
2. Ative o modo Live no dashboard
3. Substitua as chaves de teste pelas chaves de produção
4. Atualize o webhook para apontar para o domínio real

## Estrutura dos planos

| Plano   | Preço      | Intervalo |
|---------|------------|-----------|
| Mensal  | R$ 49,90   | Mês       |
| Anual   | R$ 399,00  | Ano       |

Para alterar os preços, edite o arquivo `src/lib/stripe.js`.

## Painel Admin

Acesse `/admin` com o email `baltarejo@gmail.com` para ver:
- Total de usuários
- Assinantes premium
- Histórico de pagamentos
- Status das assinaturas

## Fluxo de pagamento

1. Usuário acessa `/planos`
2. Escolhe plano mensal ou anual
3. É redirecionado para o checkout do Stripe
4. Paga com cartão
5. Stripe envia webhook para `/api/webhooks/stripe`
6. Sistema atualiza perfil para "premium" automaticamente
7. Usuário é redirecionado para página de sucesso
8. Se a assinatura for cancelada/expirar, o perfil volta para "free"
