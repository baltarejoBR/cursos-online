// Gera embeddings para todas as entries aprovadas da base de conhecimento
// Executar: node scripts/generate-embeddings.js

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

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_API_KEY = env.OPENAI_API_KEY;

const supaHeaders = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};

async function generateEmbedding(text) {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: 'text-embedding-3-small', input: text }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'OpenAI error');
  return data.data[0].embedding;
}

async function main() {
  // Buscar entries sem embedding
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/knowledge_base?status=eq.approved&embedding=is.null&select=id,question,answer,category`,
    { headers: supaHeaders }
  );
  const entries = await res.json();

  if (!res.ok) {
    console.error('Erro ao buscar entries:', JSON.stringify(entries));
    return;
  }

  console.log(`${entries.length} entries sem embedding encontradas.\n`);

  let count = 0;
  for (const entry of entries) {
    const textForEmbedding = `${entry.question}\n${entry.answer}`;

    try {
      const embedding = await generateEmbedding(textForEmbedding);

      const updateRes = await fetch(
        `${SUPABASE_URL}/rest/v1/knowledge_base?id=eq.${entry.id}`,
        {
          method: 'PATCH',
          headers: { ...supaHeaders, 'Prefer': 'return=minimal' },
          body: JSON.stringify({ embedding: JSON.stringify(embedding) }),
        }
      );

      if (!updateRes.ok) {
        const errText = await updateRes.text();
        console.error(`  [ERRO] ${entry.question.slice(0, 50)}: ${errText}`);
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
