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

// GET - Buscar na base de conhecimento
// ?q=como preparar cds  (busca fuzzy)
// &category=protocolo    (filtro opcional)
// &status=all            (admin: mostra todos os status)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const category = searchParams.get('category');
  const status = searchParams.get('status'); // 'all' para admin ver tudo
  const supabaseAdmin = createAdminSupabase();

  // Se admin pediu status=all, verificar permissao
  if (status === 'all') {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 403 });
    }

    // Listar todas as entries para o admin
    let adminQuery = supabaseAdmin
      .from('knowledge_base')
      .select('*')
      .order('created_at', { ascending: false });

    if (category) {
      adminQuery = adminQuery.eq('category', category);
    }

    const { data, error } = await adminQuery;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ entries: data });
  }

  // Busca publica - apenas approved
  if (!query) {
    // Sem query: retorna todas aprovadas (ou filtradas por categoria)
    let listQuery = supabaseAdmin
      .from('knowledge_base')
      .select('id, question, answer, category, tags, created_at')
      .eq('status', 'approved')
      .order('category')
      .order('created_at', { ascending: false });

    if (category) {
      listQuery = listQuery.eq('category', category);
    }

    const { data, error } = await listQuery;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ entries: data });
  }

  // Busca fuzzy com pg_trgm
  const { data: results, error: searchError } = await supabaseAdmin.rpc('search_knowledge_base', {
    search_query: query,
    min_similarity: 0.3,
    max_results: 5,
    filter_category: category || null,
  });

  if (searchError) {
    // Fallback: busca simples com ILIKE se a function nao existir
    let fallbackQuery = supabaseAdmin
      .from('knowledge_base')
      .select('id, question, answer, category, tags, created_at')
      .eq('status', 'approved')
      .ilike('question', `%${query}%`)
      .limit(5);

    if (category) {
      fallbackQuery = fallbackQuery.eq('category', category);
    }

    const { data: fallbackData } = await fallbackQuery;

    if (fallbackData && fallbackData.length > 0) {
      return NextResponse.json({ found: true, entries: fallbackData });
    }

    // Nenhum resultado - registrar pergunta e notificar n8n
    return await registerUnansweredQuestion(supabaseAdmin, query, category);
  }

  if (results && results.length > 0) {
    return NextResponse.json({ found: true, entries: results });
  }

  // Nenhum resultado - registrar e notificar
  return await registerUnansweredQuestion(supabaseAdmin, query, category);
}

async function registerUnansweredQuestion(supabaseAdmin, question, category) {
  // Verificar se ja existe uma pergunta pending similar
  const { data: existing } = await supabaseAdmin
    .from('knowledge_base')
    .select('id, question')
    .eq('status', 'pending')
    .ilike('question', `%${question.slice(0, 30)}%`)
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json({
      found: false,
      message: 'Essa pergunta ja foi registrada e esta aguardando resposta.',
      entry_id: existing[0].id,
    });
  }

  // Inserir nova pergunta pendente
  const { data: newEntry, error: insertError } = await supabaseAdmin
    .from('knowledge_base')
    .insert({
      question,
      category: category || 'geral',
      status: 'pending',
      asked_by: 'usuario',
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Disparar webhook n8n (fire-and-forget)
  const n8nUrl = process.env.N8N_WEBHOOK_URL;
  if (n8nUrl) {
    fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entry_id: newEntry.id,
        question: newEntry.question,
        category: newEntry.category,
        asked_by: newEntry.asked_by,
        site_url: process.env.NEXT_PUBLIC_SITE_URL || 'https://metodocorpolimpo.com.br',
      }),
    }).catch(() => {}); // fire-and-forget
  }

  return NextResponse.json({
    found: false,
    message: 'Pergunta registrada! Gabriel vai responder em breve.',
    entry_id: newEntry.id,
  });
}

// POST - Admin: adicionar ou editar entry
export async function POST(request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 403 });
  }

  const body = await request.json();
  const { id, question, answer, category, tags, status: entryStatus } = body;
  const supabaseAdmin = createAdminSupabase();

  if (id) {
    // Atualizar entry existente
    const updateData = {};
    if (question !== undefined) updateData.question = question;
    if (answer !== undefined) updateData.answer = answer;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags;
    if (entryStatus !== undefined) {
      updateData.status = entryStatus;
      if (entryStatus === 'approved') updateData.approved_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from('knowledge_base')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ entry: data });
  }

  // Criar nova entry
  if (!question) {
    return NextResponse.json({ error: 'Campo "question" e obrigatorio' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('knowledge_base')
    .insert({
      question,
      answer: answer || null,
      category: category || 'geral',
      tags: tags || [],
      status: answer ? 'approved' : 'pending',
      asked_by: 'admin',
      approved_at: answer ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entry: data });
}

// DELETE - Admin: remover entry
export async function DELETE(request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID e obrigatorio' }, { status: 400 });
  }

  const supabaseAdmin = createAdminSupabase();
  const { error } = await supabaseAdmin
    .from('knowledge_base')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
