import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

// Rota temporaria para testar conexao Stripe na Vercel
export async function GET() {
  const results = {};

  // 1. Verificar chave
  const key = process.env.STRIPE_SECRET_KEY;
  results.keyPresent = !!key;
  results.keyPrefix = key ? key.substring(0, 15) : 'MISSING';

  // 2. Tentar criar cliente Stripe e fazer chamada
  try {
    const stripe = getStripe();
    const balance = await stripe.balance.retrieve();
    results.stripeConnection = 'OK';
    results.livemode = balance.livemode;
  } catch (e) {
    results.stripeConnection = 'FAILED';
    results.stripeError = e.message;
    results.stripeErrorType = e.type;
    results.stripeRawType = e.rawType;
  }

  // 3. Tentar criar checkout session
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'brl',
          product_data: { name: 'Teste' },
          unit_amount: 100,
        },
        quantity: 1,
      }],
      success_url: 'https://metodocorpolimpo.com.br/pagamento/sucesso',
      cancel_url: 'https://metodocorpolimpo.com.br/planos',
    });
    results.checkoutSession = 'OK';
    results.checkoutUrl = session.url;
  } catch (e) {
    results.checkoutSession = 'FAILED';
    results.checkoutError = e.message;
  }

  return NextResponse.json(results);
}
