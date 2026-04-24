import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createAdminSupabase } from '@/lib/supabase-admin';
import { PRODUCTS } from '@/lib/products';
import { sendPurchaseConfirmationEmail, sendAccessGrantedEmail, createOrUpdateBrevoContact } from '@/lib/brevo';
import { sendCapiEvent } from '@/lib/meta-capi';
import { CONSENT_REVOKED } from '@/lib/consent';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_GROUP_ID = process.env.TELEGRAM_GROUP_ID;
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

async function telegramAPI(method, params) {
  if (!TELEGRAM_BOT_TOKEN) return null;
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!data.ok) console.error(`Telegram ${method} error:`, data.description);
    return data;
  } catch (err) {
    console.error(`Telegram ${method} failed:`, err.message);
    return null;
  }
}

async function addMemberToTelegramGroup(telegramUsername, userName) {
  // Gerar link de convite único (válido para 1 pessoa, expira em 24h)
  const invite = await telegramAPI('createChatInviteLink', {
    chat_id: TELEGRAM_GROUP_ID,
    member_limit: 1,
    expire_date: Math.floor(Date.now() / 1000) + 86400,
    name: `Convite para ${userName}`,
  });

  if (!invite?.result?.invite_link) return;

  // Enviar link por DM para o usuário
  const chatResult = await telegramAPI('getChat', { chat_id: `@${telegramUsername}` });
  if (chatResult?.result?.id) {
    await telegramAPI('sendMessage', {
      chat_id: chatResult.result.id,
      text: `Olá ${userName}! 🎉\n\nSeu pagamento foi confirmado! Acesse o grupo exclusivo TEAmor pelo link abaixo:\n\n${invite.result.invite_link}\n\n⚠️ Este link é válido por 24 horas e funciona apenas uma vez.`,
    });
  }

  // Notificar admin
  if (TELEGRAM_ADMIN_CHAT_ID) {
    await telegramAPI('sendMessage', {
      chat_id: TELEGRAM_ADMIN_CHAT_ID,
      text: `✅ Novo membro premium!\n\nNome: ${userName}\nTelegram: @${telegramUsername}\nLink de convite enviado.`,
    });
  }
}

async function removeMemberFromTelegramGroup(telegramUsername, userName) {
  const chatResult = await telegramAPI('getChat', { chat_id: `@${telegramUsername}` });
  if (!chatResult?.result?.id) return;

  const telegramUserId = chatResult.result.id;

  // Banir (remove do grupo)
  await telegramAPI('banChatMember', {
    chat_id: TELEGRAM_GROUP_ID,
    user_id: telegramUserId,
  });

  // Desbanir para permitir re-entrada futura
  await telegramAPI('unbanChatMember', {
    chat_id: TELEGRAM_GROUP_ID,
    user_id: telegramUserId,
    only_if_banned: true,
  });

  // Notificar admin
  if (TELEGRAM_ADMIN_CHAT_ID) {
    await telegramAPI('sendMessage', {
      chat_id: TELEGRAM_ADMIN_CHAT_ID,
      text: `🚫 Membro removido do grupo\n\nNome: ${userName}\nTelegram: @${telegramUsername}\nMotivo: Assinatura cancelada`,
    });
  }
}

async function notifyAdminPaymentFailed(telegramUsername, userName, userEmail) {
  if (!TELEGRAM_ADMIN_CHAT_ID) return;
  await telegramAPI('sendMessage', {
    chat_id: TELEGRAM_ADMIN_CHAT_ID,
    text: `⚠️ Falha no pagamento!\n\nNome: ${userName}\nEmail: ${userEmail}\nTelegram: ${telegramUsername ? `@${telegramUsername}` : 'Não informado'}\n\nA assinatura está em atraso.`,
  });
}

export async function POST(request) {
  const stripe = getStripe();
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabaseAdmin = createAdminSupabase();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata.supabase_user_id;
        const planType = session.metadata.plan_type;
        const productId = session.metadata.product_id;
        const productType = session.metadata.product_type;

        // Registrar pagamento (vale para todos os modos)
        try {
          await supabaseAdmin.from('payments').upsert({
            user_id: userId,
            stripe_payment_intent_id: session.payment_intent || `checkout_${session.id}`,
            amount: session.amount_total,
            currency: session.currency,
            status: 'succeeded',
          }, { onConflict: 'stripe_payment_intent_id' });
        } catch (paymentErr) {
          console.error('Payment record error (continuing):', paymentErr.message);
        }

        if (session.mode === 'subscription') {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);

          // Criar/atualizar assinatura no banco
          await supabaseAdmin.from('subscriptions').upsert({
            user_id: userId,
            stripe_customer_id: session.customer,
            stripe_subscription_id: subscription.id,
            plan_type: planType || productId,
            status: 'active',
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          }, {
            onConflict: 'stripe_subscription_id',
          });

          // Dar acesso ao produto
          if (productId) {
            // Verificar se ja existe acesso
            const { data: existingAccess } = await supabaseAdmin
              .from('user_products')
              .select('id')
              .eq('user_id', userId)
              .eq('product_id', productId)
              .single();

            if (existingAccess) {
              await supabaseAdmin
                .from('user_products')
                .update({ active: true, granted_by: 'stripe', granted_at: new Date().toISOString() })
                .eq('id', existingAccess.id);
            } else {
              await supabaseAdmin.from('user_products').insert({
                user_id: userId,
                product_id: productId,
                active: true,
                granted_by: 'stripe',
                granted_at: new Date().toISOString(),
              });
            }
          }

          // Atualizar perfil para premium
          await supabaseAdmin
            .from('profiles')
            .update({
              plan: 'premium',
              stripe_customer_id: session.customer,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);

          // Buscar telegram_username e notificar n8n para adicionar ao grupo
          const { data: newProfile } = await supabaseAdmin
            .from('profiles')
            .select('full_name, telegram_username')
            .eq('id', userId)
            .single();

          if (newProfile?.telegram_username) {
            await addMemberToTelegramGroup(newProfile.telegram_username, newProfile.full_name);
          }
        } else if (session.mode === 'payment' && productId) {
          // Pagamento unico - dar acesso ao produto
          await supabaseAdmin.from('user_products').upsert({
            user_id: userId,
            product_id: productId,
            active: true,
            granted_by: 'stripe',
            granted_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,product_id',
          });

          // Tambem criar enrollment se existir curso correspondente
          const { data: course } = await supabaseAdmin
            .from('courses')
            .select('id')
            .eq('slug', productId)
            .single();

          if (course) {
            await supabaseAdmin.from('enrollments').insert({
              user_id: userId,
              course_id: course.id,
              enrolled_at: new Date().toISOString(),
            });
          }

          // Atualizar stripe_customer_id no perfil
          await supabaseAdmin
            .from('profiles')
            .update({
              stripe_customer_id: session.customer,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);
        }

        // Enviar emails de confirmacao
        const { data: buyerProfile } = await supabaseAdmin
          .from('profiles')
          .select('full_name')
          .eq('id', userId)
          .single();

        const product = PRODUCTS.find(p => p.id === productId);
        const buyerEmail = session.customer_details?.email || session.customer_email;
        const buyerName = buyerProfile?.full_name || session.customer_details?.name || '';

        if (buyerEmail && product) {
          await sendPurchaseConfirmationEmail(buyerEmail, buyerName, product.title, product.priceDisplay);
          await sendAccessGrantedEmail(buyerEmail, buyerName, product.title);
        }

        // Update Brevo contact with purchase info
        if (buyerEmail) {
          createOrUpdateBrevoContact({
            email: buyerEmail,
            attributes: {
              COMPROU: 'true',
              PRODUTO_COMPRADO: productId || '',
              PLANO: session.mode === 'subscription' ? 'premium' : undefined,
            },
          }).catch(err => console.error('Brevo purchase update error:', err.message));

          // Update CRM contact with purchase data
          const amountBRL = (session.amount_total || 0) / 100;
          supabaseAdmin.from('contacts')
            .select('id, total_spent, total_purchases, products_purchased')
            .eq('email', buyerEmail.toLowerCase())
            .single()
            .then(async ({ data: existing }) => {
              const updates = {
                email: buyerEmail.toLowerCase(),
                stripe_customer_id: session.customer,
                lifecycle_stage: 'customer',
                access_level: 'aluno',
                last_purchase_at: new Date().toISOString(),
                total_spent: (existing?.total_spent || 0) + amountBRL,
                total_purchases: (existing?.total_purchases || 0) + 1,
                products_purchased: [...new Set([...(existing?.products_purchased || []), productId].filter(Boolean))],
              };
              if (buyerName) updates.full_name = buyerName;
              if (session.mode === 'subscription') {
                updates.plan = 'premium';
                updates.subscription_status = 'active';
              }
              await supabaseAdmin.from('contacts').upsert(updates, { onConflict: 'email' });
            }).catch(err => console.error('CRM purchase sync error:', err.message));

          // Meta CAPI Purchase (event_id = session.id pra dedup com browser fbq em /pagamento/sucesso).
          // LGPD: checkout propaga user_consent no metadata da Stripe session. Se 'revoked', nao dispara.
          const [firstName, ...lastNameParts] = (buyerName || '').trim().split(/\s+/);
          const address = session.customer_details?.address || {};
          if (session.metadata?.user_consent !== CONSENT_REVOKED) {
          sendCapiEvent({
            eventName: 'Purchase',
            eventId: session.id,
            user: {
              email: buyerEmail,
              phone: session.customer_details?.phone || undefined,
              firstName: firstName || undefined,
              lastName: lastNameParts.length ? lastNameParts.join(' ') : undefined,
              city: address.city || undefined,
              state: address.state || undefined,
              country: address.country || undefined,
              externalId: userId || undefined,
            },
            custom: {
              value: amountBRL,
              currency: (session.currency || 'brl').toUpperCase(),
              contentName: product?.title,
              contentIds: productId ? [productId] : undefined,
            },
            sourceUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://metodocorpolimpo.com.br'}/pagamento/sucesso`,
            actionSource: 'website',
          }).catch(err => console.error('[stripe webhook] meta capi Purchase error:', err.message));
          }
        }

        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
          const customerId = invoice.customer;

          // Buscar user_id pelo stripe_customer_id
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('stripe_customer_id', customerId)
            .single();

          if (profile) {
            // Atualizar período da assinatura
            await supabaseAdmin
              .from('subscriptions')
              .update({
                status: 'active',
                current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('stripe_subscription_id', invoice.subscription);

            // Garantir que o perfil está como premium
            await supabaseAdmin
              .from('profiles')
              .update({ plan: 'premium', updated_at: new Date().toISOString() })
              .eq('id', profile.id);

            // Registrar pagamento
            try {
              await supabaseAdmin.from('payments').upsert({
                user_id: profile.id,
                stripe_payment_intent_id: invoice.payment_intent || `invoice_${invoice.id}`,
                amount: invoice.amount_paid,
                currency: invoice.currency,
                status: 'succeeded',
              }, { onConflict: 'stripe_payment_intent_id' });
            } catch (paymentErr) {
              console.error('Invoice payment record error (continuing):', paymentErr.message);
            }
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = invoice.customer;

        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (profile) {
          await supabaseAdmin
            .from('subscriptions')
            .update({
              status: 'past_due',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', invoice.subscription);

          // Notificar admin sobre falha de pagamento
          const { data: failedProfile } = await supabaseAdmin
            .from('profiles')
            .select('full_name, telegram_username')
            .eq('id', profile.id)
            .single();

          await notifyAdminPaymentFailed(
            failedProfile?.telegram_username,
            failedProfile?.full_name || '',
            invoice.customer_email || ''
          );
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (profile) {
          const status = subscription.status === 'active' ? 'active'
            : subscription.status === 'past_due' ? 'past_due'
            : subscription.status === 'canceled' ? 'canceled'
            : 'expired';

          await supabaseAdmin
            .from('subscriptions')
            .update({
              status,
              cancel_at_period_end: subscription.cancel_at_period_end,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscription.id);

          // Se cancelou, atualizar perfil
          if (status === 'canceled') {
            await supabaseAdmin
              .from('profiles')
              .update({ plan: 'free', updated_at: new Date().toISOString() })
              .eq('id', profile.id);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (profile) {
          await supabaseAdmin
            .from('subscriptions')
            .update({
              status: 'canceled',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscription.id);

          // Voltar perfil para free
          await supabaseAdmin
            .from('profiles')
            .update({ plan: 'free', updated_at: new Date().toISOString() })
            .eq('id', profile.id);

          // Remover do grupo do Telegram
          const { data: canceledProfile } = await supabaseAdmin
            .from('profiles')
            .select('full_name, telegram_username')
            .eq('id', profile.id)
            .single();

          if (canceledProfile?.telegram_username) {
            await removeMemberFromTelegramGroup(canceledProfile.telegram_username, canceledProfile.full_name);
          }

          // Update Brevo contact to reflect downgrade
          const customer = await stripe.customers.retrieve(customerId);
          if (customer?.email) {
            createOrUpdateBrevoContact({
              email: customer.email,
              attributes: { PLANO: 'free' },
            }).catch(err => console.error('Brevo downgrade error:', err.message));

            // Update CRM contact subscription status
            supabaseAdmin.from('contacts')
              .update({ subscription_status: 'canceled', plan: 'free' })
              .eq('email', customer.email.toLowerCase())
              .then(({ error }) => { if (error) console.error('CRM sub cancel error:', error.message); });
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
