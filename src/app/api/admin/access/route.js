import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { createAdminSupabase } from '@/lib/supabase-admin';

const ADMIN_EMAILS = ['baltarejo@gmail.com'];

async function verifyAdmin() {
  const supabase = createServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return null;
  }
  return user;
}

// GET - Listar acessos (opcionalmente filtrar por user_id)
export async function GET(request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  const supabaseAdmin = createAdminSupabase();

  let query = supabaseAdmin
    .from('user_products')
    .select('*')
    .order('granted_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ accesses: data || [] });
}

// POST - Conceder acesso a um produto
export async function POST(request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 403 });
  }

  const { user_id, product_id, notes } = await request.json();

  if (!user_id || !product_id) {
    return NextResponse.json({ error: 'user_id e product_id sao obrigatorios' }, { status: 400 });
  }

  const supabaseAdmin = createAdminSupabase();

  // Verificar se ja existe (mesmo inativo)
  const { data: existing } = await supabaseAdmin
    .from('user_products')
    .select('id, active')
    .eq('user_id', user_id)
    .eq('product_id', product_id)
    .single();

  if (existing) {
    // Reativar se estava inativo
    const { error } = await supabaseAdmin
      .from('user_products')
      .update({ active: true, granted_at: new Date().toISOString(), notes: notes || null })
      .eq('id', existing.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Acesso reativado' });
  }

  const { error } = await supabaseAdmin
    .from('user_products')
    .insert({
      user_id,
      product_id,
      granted_by: admin.email,
      notes: notes || null,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Acesso concedido' });
}

// DELETE - Remover acesso a um produto
export async function DELETE(request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 403 });
  }

  const { user_id, product_id } = await request.json();

  if (!user_id || !product_id) {
    return NextResponse.json({ error: 'user_id e product_id sao obrigatorios' }, { status: 400 });
  }

  const supabaseAdmin = createAdminSupabase();

  const { error } = await supabaseAdmin
    .from('user_products')
    .update({ active: false })
    .eq('user_id', user_id)
    .eq('product_id', product_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Acesso removido' });
}
