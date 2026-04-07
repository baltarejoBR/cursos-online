import { NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase-admin';
import { sendLeadCouponEmail } from '@/lib/brevo';

function generateCouponCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `DIOXI-${code}`;
}

export async function POST(req) {
  try {
    const { email, name, source } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email invalido' }, { status: 400 });
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
        coupon_code: existing.coupon_code,
        message: 'Voce ja tem um cupom! Use ele na loja.',
      });
    }

    // Generate unique coupon
    let coupon_code = generateCouponCode();
    let attempts = 0;
    while (attempts < 5) {
      const { data: dup } = await supabase
        .from('leads')
        .select('id')
        .eq('coupon_code', coupon_code)
        .single();
      if (!dup) break;
      coupon_code = generateCouponCode();
      attempts++;
    }

    // Insert lead
    const { error } = await supabase.from('leads').insert({
      email: email.toLowerCase().trim(),
      name: name || null,
      coupon_code,
      source: source || 'popup',
    });

    if (error) {
      console.error('Lead insert error:', error.message);
      return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 });
    }

    // Send email with coupon (non-blocking)
    sendLeadCouponEmail(email, name, coupon_code).catch(err =>
      console.error('Lead email failed:', err.message)
    );

    return NextResponse.json({
      coupon_code,
      message: 'Cupom gerado com sucesso!',
    });
  } catch (err) {
    console.error('Leads API error:', err.message);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
