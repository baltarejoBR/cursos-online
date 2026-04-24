import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { sendCapiEvent } from '@/lib/meta-capi';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function POST(request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    if (session.metadata?.tipo === 'desparasitacao') {
      const { error } = await getSupabase()
        .from('desp_participantes')
        .update({
          stripe_payment_status: 'pago',
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_session_id', session.id);

      if (error) {
        console.error('Error updating participant:', error);
      }

      // Meta CAPI Purchase (event_id = session.id pra dedup com browser fbq em /pagamento/sucesso).
      const buyerEmail = session.customer_details?.email || session.customer_email;
      if (buyerEmail) {
        const buyerName = session.customer_details?.name || '';
        const [firstName, ...lastNameParts] = buyerName.trim().split(/\s+/);
        const address = session.customer_details?.address || {};
        const amountBRL = (session.amount_total || 0) / 100;
        const plano = session.metadata?.plano || 'desparasitacao';
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
          },
          custom: {
            value: amountBRL,
            currency: (session.currency || 'brl').toUpperCase(),
            contentName: `Desparasitação ${plano}`,
            contentIds: [`desparasitacao-${plano}`],
          },
          sourceUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://metodocorpolimpo.com.br'}/pagamento/sucesso`,
          actionSource: 'website',
        }).catch(err => console.error('[desparasitacao webhook] meta capi Purchase error:', err.message));
      }
    }
  }

  return NextResponse.json({ received: true });
}
