import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createAdminSupabase } from '@/lib/supabase-admin';
import { generateEmbedding } from '@/lib/embeddings';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `Voce e o assistente virtual do Metodo Corpo Limpo, uma plataforma sobre CDS (Chlorine Dioxide Solution / Dioxido de Cloro).

REGRAS IMPORTANTES:
1. Responda SOMENTE com base nas informacoes fornecidas na BASE DE CONHECIMENTO abaixo.
2. Se a informacao nao estiver na base de conhecimento, diga claramente: "Ainda nao tenho essa informacao na minha base. Vou registrar sua pergunta para que o Gabriel responda em breve!"
3. NUNCA invente informacoes sobre dosagens, protocolos ou procedimentos que nao estejam na base.
4. Seja amigavel, objetivo e em portugues brasileiro.
5. Use linguagem simples e acessivel.
6. Se a pergunta nao for sobre CDS/saude, diga educadamente que voce so responde sobre temas relacionados ao Metodo Corpo Limpo.
7. Quando mencionar dosagens ou protocolos, sempre reforce que a pessoa deve comecar com doses baixas e observar as reacoes do corpo.`;

export async function POST(request) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mensagem e obrigatoria' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'API key nao configurada' }, { status: 500 });
    }

    const supabaseAdmin = createAdminSupabase();

    // 1. Gerar embedding da pergunta do usuario
    const queryEmbedding = await generateEmbedding(message);

    // 2. Busca semantica com pgvector
    const { data: semanticResults } = await supabaseAdmin.rpc('search_knowledge_base_semantic', {
      query_embedding: JSON.stringify(queryEmbedding),
      match_threshold: 0.3,
      match_count: 8,
    });

    let contextEntries = semanticResults || [];
    // Considerar relevante apenas se o melhor resultado tiver similaridade >= 0.5
    const bestScore = contextEntries.length > 0 ? (contextEntries[0].similarity || 0) : 0;
    const hasRelevantContext = bestScore >= 0.5;

    // 3. Busca complementar por texto (ILIKE) para pegar entries sem embedding
    const { data: textMatches } = await supabaseAdmin
      .from('knowledge_base')
      .select('question, answer, category')
      .eq('status', 'approved')
      .ilike('question', `%${message.slice(0, 40)}%`)
      .limit(5);

    if (textMatches && textMatches.length > 0) {
      const existingQuestions = new Set(contextEntries.map(e => e.question));
      for (const match of textMatches) {
        if (!existingQuestions.has(match.question)) {
          contextEntries.push(match);
        }
      }
    }

    // 4. Fallback: busca fuzzy por texto se semantica nao retornar nada
    if (contextEntries.length === 0) {
      const { data: textResults } = await supabaseAdmin.rpc('search_knowledge_base', {
        search_query: message,
        min_similarity: 0.15,
        max_results: 8,
        filter_category: null,
      });
      contextEntries = textResults || [];
    }

    // 5. Ultimo fallback: todas as entries aprovadas (inclui entries sem embedding)
    if (contextEntries.length === 0 || !hasRelevantContext) {
      const { data: allEntries } = await supabaseAdmin
        .from('knowledge_base')
        .select('question, answer, category')
        .eq('status', 'approved')
        .limit(30);
      if (allEntries && allEntries.length > 0) {
        const existingQuestions = new Set(contextEntries.map(e => e.question));
        for (const entry of allEntries) {
          if (!existingQuestions.has(entry.question)) {
            contextEntries.push(entry);
          }
        }
      }
    }

    // Montar contexto da base de conhecimento
    const kbContext = contextEntries
      .map(e => `[${e.category}] Pergunta: ${e.question}\nResposta: ${e.answer}`)
      .join('\n\n---\n\n');

    // Montar historico (ultimas 10 mensagens)
    const conversationHistory = (history || []).slice(-10).map(msg => ({
      role: msg.role === 'bot' ? 'assistant' : 'user',
      content: msg.text,
    }));

    // Adicionar mensagem atual
    conversationHistory.push({
      role: 'user',
      content: message,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 800,
      messages: [
        {
          role: 'system',
          content: `${SYSTEM_PROMPT}\n\n--- BASE DE CONHECIMENTO ---\n\n${kbContext}\n\n--- FIM DA BASE ---`,
        },
        ...conversationHistory,
      ],
    });

    const botResponse = response.choices[0].message.content;

    // Registrar pergunta se nao teve contexto relevante na base
    // OU se o GPT indicou que nao sabe
    const noInfoPhrases = [
      'nao tenho essa informacao', 'vou registrar', 'ainda nao tenho',
      'nao possuo essa informacao', 'nao encontrei', 'nao sei responder',
      'nao tenho informacao', 'base de conhecimento nao', 'nao consta',
      'gabriel responda', 'fora do escopo',
    ];
    const gptSaidNoInfo = noInfoPhrases.some(phrase => botResponse.toLowerCase().includes(phrase));
    const needsRegistration = !hasRelevantContext || gptSaidNoInfo;

    if (needsRegistration) {
      const { data: existing } = await supabaseAdmin
        .from('knowledge_base')
        .select('id')
        .eq('status', 'pending')
        .ilike('question', `%${message.slice(0, 30)}%`)
        .limit(1);

      if (!existing || existing.length === 0) {
        const { data: newEntry } = await supabaseAdmin
          .from('knowledge_base')
          .insert({
            question: message,
            category: 'geral',
            status: 'pending',
            asked_by: 'chatbot',
          })
          .select()
          .single();

        // Disparar webhook n8n
        const n8nUrl = process.env.N8N_WEBHOOK_URL;
        if (n8nUrl && newEntry) {
          fetch(n8nUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              entry_id: newEntry.id,
              question: message,
              category: 'geral',
              asked_by: 'chatbot',
              site_url: process.env.NEXT_PUBLIC_SITE_URL || 'https://metodocorpolimpo.com.br',
            }),
          }).catch(() => {});
        }
      }
    }

    return NextResponse.json({ response: botResponse });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Erro ao processar mensagem' },
      { status: 500 }
    );
  }
}
