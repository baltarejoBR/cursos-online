import { NextResponse } from 'next/server';
import { getStripe, PLANS } from '@/lib/stripe';
import { createServerSupabase } from '@/lib/supabase-server';
import { createAdminSupabase } from '@/lib/supabase-admin';
import { PRODUCTS } from '@/lib/products';

export async function POST(request) {
  try {
    const body = await request.json();
    const { planType, productId } = body;

    const stripe = getStripe();
    const origin = new URL(request.url).origin;

    // Verificar autenticação
    const supabase = createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Voce precisa estar logado' }, { status: 401 });
    }

    const supabaseAdmin = createAdminSupabase();

    // Buscar ou criar customer no Stripe
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id, full_name')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.full_name || '',
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await supabaseAdmin
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    // === Compra de produto individual ===
    if (productId) {
      const product = PRODUCTS.find(p => p.id === productId);
      if (!product || product.type === 'external') {
        return NextResponse.json({ error: 'Produto invalido' }, { status: 400 });
      }

      if (product.type === 'subscription') {
        // Produto com assinatura recorrente
        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          mode: 'subscription',
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'brl',
                product_data: {
                  name: product.title,
                  description: product.subtitle || product.description,
                },
                unit_amount: product.price,
                recurring: {
                  interval: product.interval || 'month',
                },
              },
              quantity: 1,
            },
          ],
          metadata: {
            supabase_user_id: user.id,
            product_id: product.id,
            product_type: 'subscription',
          },
          success_url: `${origin}/pagamento/sucesso?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/produto/${product.slug}`,
          allow_promotion_codes: true,
        });

        return NextResponse.json({ url: session.url });
      }

      // Produto com pagamento unico
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'brl',
              product_data: {
                name: product.title,
                description: product.subtitle || product.description,
              },
              unit_amount: product.price,
            },
            quantity: 1,
          },
        ],
        metadata: {
          supabase_user_id: user.id,
          product_id: product.id,
          product_type: 'one_time',
        },
        success_url: `${origin}/pagamento/sucesso?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/produto/${product.slug}`,
        allow_promotion_codes: true,
      });

      return NextResponse.json({ url: session.url });
    }

    // === Plano de assinatura (legado) ===
    if (planType && PLANS[planType]) {
      const plan = PLANS[planType];

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'brl',
              product_data: {
                name: `Metodo Corpo Limpo - Plano ${plan.name}`,
                description: plan.description,
              },
              unit_amount: plan.price,
              recurring: {
                interval: plan.interval,
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          supabase_user_id: user.id,
          plan_type: planType,
        },
        success_url: `${origin}/pagamento/sucesso?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/planos`,
        allow_promotion_codes: true,
      });

      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json({ error: 'Produto ou plano invalido' }, { status: 400 });
  } catch (error) {
    console.error('Checkout error:', {
      message: error.message,
      stack: error.stack,
      user: user?.id,
      productId,
      planType,
      body
    });
    return NextResponse.json(
      { error: 'Erro ao criar sessao de pagamento', detail: error.message },
      { status: 500 }
    );
  }
}
