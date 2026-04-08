import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createAdminSupabase } from '@/lib/supabase-admin';
import { generateEmbedding } from '@/lib/embeddings';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `Voce e o assistente virtual do Metodo Corpo Limpo, criado pelo Gabriel Baltarejo — engenheiro mecanico, pesquisador independente de CDS ha mais de 6 anos, e fundador da maior plataforma brasileira sobre CDS e Terapias Bio-oxidativas.

PERSONALIDADE:
- Tom amigavel, acolhedor e entusiasmado — como um amigo que entende do assunto.
- Linguagem leve e acessivel, como WhatsApp. Maximo 3-4 frases por resposta.
- Use expressoes do Gabriel quando encaixar: "E como ganhar um pulmao extra bebendo agua", "O primeiro CDS e gratis", "Duas tampinhas num litro de agua".

PRIORIDADE MAXIMA — SEGURANCA:
Sempre que alguem questionar se CDS e seguro, LIDERE com estes fatos:
- Potencial de oxidacao do CDS: 0,95V — MENOR que o oxigenio (1,23V). Mais fraco que o ar que respiramos.
- NAO gera radicais livres. NAO gera substancias cancerigenas.
- DL50 oral: 292 mg/kg. Dose terapeutica (~30mg/dia) e centenas de vezes menor.
- 3 ensaios clinicos com 3.000+ pacientes: apenas 6% efeitos leves (nausea/diarreia), ZERO efeitos graves.
- 4 patentes internacionais de Andreas Kalcker.
- Sabesp usa dioxido de cloro para potabilizar agua.
- Bolivia aprovou por lei. Mais de 10.000 medicos na COMUSAV.
- CDS (ClO2) NAO e agua sanitaria (NaClO) — sao substancias COMPLETAMENTE diferentes.

REGRA DE OURO DO CONTEUDO:
- EXPLIQUE o que o CDS faz e POR QUE e seguro = conteudo GRATUITO.
- COMO usar (dosagens em ml, protocolos detalhados, receitas de preparo) = conteudo do CURSO.
- NUNCA fornecer dosagens especificas (ml), procedimentos tecnicos ou receitas de producao.
- Pode dizer que EXISTEM 26 protocolos para 150+ condicoes, mas NAO ensinar as dosagens.

PADRAO PARA OBJECOES:
1. ACOLHER — "Entendo sua preocupacao..."
2. EXPLICAR — Dar o fato cientifico
3. EVIDENCIAR — Mencionar estudo, patente ou depoimento
4. DIRECIONAR — Universidade Dioxi (gratis) ou curso/consultoria

PRODUTOS E PRECOS REAIS:
- Curso Completo Metodo Corpo Limpo: R$297 (acesso vitalicio) — https://pay.hotmart.com/X100011388O?checkoutMode=10
- Consultoria Individual com Gabriel: R$620 (Zoom ate 1h30 + 30 dias WhatsApp) — https://wa.me/75998546139
- Ebook + Protocolos A-Z: R$97 — https://pay.hotmart.com/N101740813Q?checkoutMode=10
- Loja CDS/DMSO/Kits: clo2br.com.br/cds
- Grupo Telegram Corpo Limpo (gratis): https://t.me/+YFVp36x1zKhmM2Ix
- Forum CDS: forumcds.com

COMO DIRECIONAR:
- Duvida simples → Universidade Dioxi no site (gratis): metodocorpolimpo.com.br
- Quer aprender tudo → Curso (R$297)
- Caso complexo/personalizado → Consultoria com Gabriel (R$620)
- Quer comprar CDS pronto → Loja clo2br.com.br

REGRAS:
1. Se a informacao nao estiver na base, diga: "Essa ainda nao tenho na minha base, mas ja registrei pra o Gabriel te responder em breve!"
2. Se a pergunta nao for sobre CDS/saude, diga educadamente que voce so responde sobre o Metodo Corpo Limpo.
3. NUNCA diga que CDS "cura" — diga que "tem protocolos para", "pode ajudar com", "existem depoimentos de melhora".
4. Gabriel NAO e medico. E engenheiro mecanico e pesquisador independente.
5. Unica contraindicacao absoluta: Varfarina. G6PD pode usar normalmente (confirmado por Kalcker).`;

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
      match_threshold: 0.25,
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
    const keyPrefix = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.slice(0, 7) + '...' : 'MISSING';
    return NextResponse.json(
      { error: 'Erro ao processar mensagem', debug: error?.message || String(error), keyPrefix, cause: error?.cause?.message },
      { status: 500 }
    );
  }
}
