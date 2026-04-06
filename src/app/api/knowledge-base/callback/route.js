import { NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase-admin';
import { generateEmbedding } from '@/lib/embeddings';

// POST - Callback do n8n com resposta do Gabriel
export async function POST(request) {
  // Verificar secret
  const secret = request.headers.get('x-n8n-secret');
  const expectedSecret = process.env.N8N_CALLBACK_SECRET;

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  const body = await request.json();
  const { entry_id, answer, status } = body;

  if (!entry_id || !status) {
    return NextResponse.json(
      { error: 'Campos entry_id e status sao obrigatorios' },
      { status: 400 }
    );
  }

  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json(
      { error: 'Status deve ser "approved" ou "rejected"' },
      { status: 400 }
    );
  }

  if (status === 'approved' && !answer) {
    return NextResponse.json(
      { error: 'Campo answer e obrigatorio quando status e approved' },
      { status: 400 }
    );
  }

  const supabaseAdmin = createAdminSupabase();

  const updateData = {
    status,
    answer: status === 'approved' ? answer : null,
    approved_at: status === 'approved' ? new Date().toISOString() : null,
  };

  // Gerar embedding quando aprovado
  if (status === 'approved' && answer) {
    // Buscar a pergunta original para combinar com a resposta
    const { data: entry } = await supabaseAdmin
      .from('knowledge_base')
      .select('question')
      .eq('id', entry_id)
      .single();

    if (entry) {
      try {
        const embedding = await generateEmbedding(`${entry.question}\n${answer}`);
        updateData.embedding = JSON.stringify(embedding);
      } catch {}
    }
  }

  const { data, error } = await supabaseAdmin
    .from('knowledge_base')
    .update(updateData)
    .eq('id', entry_id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Entry nao encontrada' }, { status: 404 });
  }

  return NextResponse.json({ success: true, entry: data });
}
