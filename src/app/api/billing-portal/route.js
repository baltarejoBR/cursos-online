import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createServerSupabase } from '@/lib/supabase-server';
import { createAdminSupabase } from '@/lib/supabase-admin';

export async function POST(request) {
  try {
    const origin = new URL(request.url).origin;
    const supabase = createServerSupabase();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const supabaseAdmin = createAdminSupabase();
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ error: 'Nenhuma assinatura encontrada' }, { status: 404 });
    }

    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${origin}/minha-area`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Billing portal error:', error);
    return NextResponse.json(
      { error: 'Erro ao abrir portal de pagamento' },
      { status: 500 }
    );
  }
}
