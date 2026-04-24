import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { readConsentFromRequest } from '@/lib/consent';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'ciclos';

  if (type === 'ciclos') {
    const { data, error } = await getSupabase()
      .from('desp_ciclos')
      .select('*, desp_participantes(count)')
      .order('lua_nova', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  if (type === 'participantes') {
    const cicloId = searchParams.get('ciclo_id');
    let query = getSupabase()
      .from('desp_participantes')
      .select('*')
      .order('created_at', { ascending: false });

    if (cicloId) {
      query = query.eq('ciclo_id', cicloId);
    }

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  if (type === 'protocolo') {
    const mes = searchParams.get('mes') || '1';
    const tipo = searchParams.get('tipo_protocolo');

    let query = getSupabase()
      .from('desp_protocolo_dias')
      .select('*')
      .eq('mes', Number.parseInt(mes, 10))
      .order('dia', { ascending: true });

    if (tipo) {
      query = query.in('tipo_protocolo', [tipo, 'ambos']);
    }

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  if (type === 'stats') {
    const [ciclosRes, participantesRes, pagosRes] = await Promise.all([
      getSupabase().from('desp_ciclos').select('id', { count: 'exact' }),
      getSupabase().from('desp_participantes').select('id', { count: 'exact' }),
      getSupabase().from('desp_participantes').select('id', { count: 'exact' }).eq('stripe_payment_status', 'pago'),
    ]);

    return NextResponse.json({
      total_ciclos: ciclosRes.count || 0,
      total_participantes: participantesRes.count || 0,
      total_pagos: pagosRes.count || 0,
    });
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
}

export async function POST(request) {
  const body = await request.json();
  const { action } = body;

  if (action === 'cadastro') {
    const {
      nome,
      email,
      telefone,
      data_nascimento,
      horario_nascimento,
      plano,
      questionario,
      ciclo_lua_nova,
    } = body;

    if (!nome || !email || !data_nascimento || !plano) {
      return NextResponse.json({ error: 'Campos obrigatorios: nome, email, data_nascimento, plano' }, { status: 400 });
    }

    let cicloId = null;

    if (ciclo_lua_nova) {
      const luaNova = new Date(ciclo_lua_nova).toISOString().split('T')[0];
      const { data: existingCiclo } = await getSupabase()
        .from('desp_ciclos')
        .select('id')
        .eq('lua_nova', luaNova)
        .single();

      if (existingCiclo) {
        cicloId = existingCiclo.id;
      }
    }

    if (!cicloId) {
      const { data: nextCiclo } = await getSupabase()
        .from('desp_ciclos')
        .select('id')
        .gte('lua_nova', new Date().toISOString().split('T')[0])
        .order('lua_nova', { ascending: true })
        .limit(1)
        .single();

      cicloId = nextCiclo?.id || null;
    }

    if (cicloId) {
      const { data: existing } = await getSupabase()
        .from('desp_participantes')
        .select('id')
        .eq('ciclo_id', cicloId)
        .eq('email', email)
        .single();

      if (existing) {
        return NextResponse.json({ error: 'Voce ja esta cadastrado neste ciclo' }, { status: 400 });
      }
    }

    const valor = plano === 'simples' ? 390 : 890;
    const cupom = `DESP${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const participantData = {
      nome,
      email,
      telefone: telefone || null,
      data_nascimento,
      horario_nascimento: horario_nascimento || null,
      plano,
      valor_pago: valor,
      cupom_desconto: cupom,
      questionario,
      status: 'inscrito',
      stripe_payment_status: 'pendente',
    };

    if (cicloId) {
      participantData.ciclo_id = cicloId;
    }

    if (process.env.STRIPE_SECRET_KEY) {
      try {
        const stripeModule = await import('stripe');
        const Stripe = stripeModule.default;
        const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://metodocorpolimpo.com.br';

        const session = await stripeClient.checkout.sessions.create({
          payment_method_types: ['card', 'boleto'],
          line_items: [
            {
              price_data: {
                currency: 'brl',
                product_data: {
                  name: `Desparasitacao - Protocolo ${plano === 'simples' ? 'Simples (21 dias)' : 'Completo (3 meses)'}`,
                  description: 'Acompanhamento em grupo + protocolo detalhado + cupom em produtos',
                },
                unit_amount: valor * 100,
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${siteUrl}/desparasitacao/cadastro?success=true`,
          cancel_url: `${siteUrl}/desparasitacao/cadastro?canceled=true`,
          customer_email: email,
          metadata: {
            tipo: 'desparasitacao',
            plano,
            nome,
            user_consent: readConsentFromRequest(request) || 'unset',
          },
        });

        participantData.stripe_session_id = session.id;

        const { error: insertError } = await getSupabase()
          .from('desp_participantes')
          .insert(participantData);

        if (insertError) {
          return NextResponse.json({ error: insertError.message }, { status: 500 });
        }

        return NextResponse.json({ checkout_url: session.url });
      } catch (stripeError) {
        console.error('Stripe error:', stripeError);
      }
    }

    const { error: insertError } = await getSupabase()
      .from('desp_participantes')
      .insert(participantData);

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, cupom });
  }

  if (action === 'criar_ciclo') {
    const { nome, tipo, lua_nova, lua_cheia, fim_ciclo, data_preparativos, inscricao_limite, vagas_max } = body;

    const { data, error } = await getSupabase()
      .from('desp_ciclos')
      .insert({
        nome,
        tipo: tipo || 'completo',
        lua_nova,
        lua_cheia,
        fim_ciclo,
        data_preparativos,
        inscricao_limite,
        vagas_max: vagas_max || 30,
        status: 'agendado',
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  if (action === 'atualizar_participante') {
    const { id, status, notas, stripe_payment_status } = body;
    const updates = { updated_at: new Date().toISOString() };
    if (status) updates.status = status;
    if (notas !== undefined) updates.notas = notas;
    if (stripe_payment_status) updates.stripe_payment_status = stripe_payment_status;

    const { data, error } = await getSupabase()
      .from('desp_participantes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  if (action === 'deletar_ciclo') {
    const { id } = body;
    const { error } = await getSupabase()
      .from('desp_ciclos')
      .delete()
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === 'atualizar_ciclo') {
    const { id, status } = body;

    const { data, error } = await getSupabase()
      .from('desp_ciclos')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function PATCH(request) {
  const body = await request.json();
  const { table, id, ...updates } = body;

  if (!table || !id) {
    return NextResponse.json({ error: 'table and id required' }, { status: 400 });
  }

  const tableName = table === 'ciclos' ? 'desp_ciclos' : 'desp_participantes';

  const { data, error } = await getSupabase()
    .from(tableName)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
