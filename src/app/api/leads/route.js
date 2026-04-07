import { NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase-admin';
import { sendLeadCouponEmail, createOrUpdateBrevoContact, BREVO_LIST_IDS } from '@/lib/brevo';

const CUPOM_FIXO = 'SEGUIDOR';

export async function POST(req) {
  try {
    const { email, name, source } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    const supabase = createAdminSupabase();

    // Check if email already exists
    const { data: existing } = await supabase
      .from('leads')
      .select('coupon_code')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (existing) {
      return NextResponse.json({
        coupon_code: CUPOM_FIXO,
        message: 'Você já tem um cupom! Use ele na loja.',
      });
    }

    // Insert lead
    const { error } = await supabase.from('leads').insert({
      email: email.toLowerCase().trim(),
      name: name || null,
      coupon_code: CUPOM_FIXO,
      source: source || 'popup',
    });

    if (error) {
      console.error('Lead insert error:', error.message);
      return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 });
    }

    // Send email with coupon (non-blocking)
    sendLeadCouponEmail(email, name, CUPOM_FIXO).catch(err =>
      console.error('Lead email failed:', err.message)
    );

    // Create/update Brevo contact for lead segmentation
    createOrUpdateBrevoContact({
      email: email.toLowerCase().trim(),
      attributes: {
        FIRSTNAME: name || '',
        FONTE: source || 'popup',
        DATA_CADASTRO: new Date().toISOString().split('T')[0],
        CUPOM_USADO: CUPOM_FIXO,
        COMPROU: 'false',
      },
      listIds: [BREVO_LIST_IDS.SITE_LEADS, BREVO_LIST_IDS.NEWSLETTER],
    }).catch(err => console.error('Brevo lead contact error:', err.message));

    return NextResponse.json({
      coupon_code: CUPOM_FIXO,
      message: 'Cupom gerado com sucesso!',
    });
  } catch (err) {
    console.error('Leads API error:', err.message);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
