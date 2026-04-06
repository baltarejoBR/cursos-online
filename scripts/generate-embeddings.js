// Gera embeddings para todas as entries aprovadas da base de conhecimento
// Executar: node scripts/generate-embeddings.js

const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
const { readFileSync } = require('fs');
const { resolve } = require('path');

// Ler .env.local
const envPath = resolve(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

async function generateEmbedding(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}

async function main() {
  // Buscar entries sem embedding
  const { data: entries, error } = await supabase
    .from('knowledge_base')
    .select('id, question, answer, category')
    .eq('status', 'approved')
    .is('embedding', null);

  if (error) {
    console.error('Erro ao buscar entries:', error.message);
    return;
  }

  console.log(`${entries.length} entries sem embedding encontradas.\n`);

  let count = 0;
  for (const entry of entries) {
    // Combinar pergunta + resposta para embedding mais rico
    const textForEmbedding = `${entry.question}\n${entry.answer}`;

    try {
      const embedding = await generateEmbedding(textForEmbedding);

      const { error: updateError } = await supabase
        .from('knowledge_base')
        .update({ embedding: JSON.stringify(embedding) })
        .eq('id', entry.id);

      if (updateError) {
        console.error(`  [ERRO] ${entry.question.slice(0, 50)}: ${updateError.message}`);
      } else {
        count++;
        console.log(`  [OK] ${entry.question.slice(0, 60)}`);
      }
    } catch (e) {
      console.error(`  [ERRO] ${entry.question.slice(0, 50)}: ${e.message}`);
    }
  }

  console.log(`\nPronto! ${count}/${entries.length} embeddings gerados.`);
}

main().catch(console.error);
