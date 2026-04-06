// Script para popular a base de conhecimento com perguntas frequentes sobre CDS
// Executar: node scripts/seed-knowledge-base.js
//
// Requer as env vars: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY

const { createClient } = require('@supabase/supabase-js');
const { readFileSync } = require('fs');
const { resolve } = require('path');

// Ler .env.local manualmente
const envPath = resolve(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

const SEED_DATA = [
  // === GERAL ===
  {
    question: 'O que e CDS e como funciona?',
    answer: 'CDS (Chlorine Dioxide Solution) e uma solucao aquosa de dioxido de cloro (ClO2) a 0,3%. Funciona como um oxidante seletivo que atua sobre patogenos (bacterias, virus, fungos e parasitas) sem agredir as celulas saudaveis do corpo, pois estas possuem pH mais elevado que os microrganismos.',
    category: 'geral',
    tags: ['iniciante', 'basico', 'definicao'],
  },
  {
    question: 'Qual a diferenca entre CDS, CDL e MMS?',
    answer: 'MMS (Miracle Mineral Supplement) e o clorito de sodio ativado com acido, produzindo gas de dioxido de cloro. CDL (Chlordioxid Losung) e o mesmo que CDS, apenas o nome em alemao. CDS e a solucao purificada: o gas do dioxido de cloro e capturado em agua destilada, resultando em uma solucao mais pura, sem residuos acidos. O CDS e considerado mais seguro e eficaz que o MMS.',
    category: 'geral',
    tags: ['iniciante', 'basico', 'diferenca'],
  },
  {
    question: 'Por onde devo comecar a usar CDS?',
    answer: 'Comece pelo Protocolo C (protocolo basico de desintoxicacao). Inicie com doses baixas (2-3ml de CDS em 1 litro de agua) e va aumentando gradualmente ate 10ml por litro. Tome em 8-10 doses ao longo do dia, com intervalo de 1 hora entre cada dose. Observe as reacoes do seu corpo e ajuste conforme necessario.',
    category: 'geral',
    tags: ['iniciante', 'primeiro-uso'],
  },
  {
    question: 'O CDS tem cheiro ou gosto?',
    answer: 'Sim, o CDS tem um leve cheiro e gosto de cloro, semelhante a agua de piscina. Isso e normal e indica que o produto esta ativo. Para quem acha desagradavel, pode-se adicionar um pouco de suco natural (sem vitamina C adicionada) para mascarar o sabor. Nunca use suco de laranja ou limao pois a vitamina C neutraliza o efeito.',
    category: 'geral',
    tags: ['iniciante', 'sabor'],
  },

  // === PROTOCOLOS ===
  {
    question: 'O que e o Protocolo C e como fazer?',
    answer: 'O Protocolo C e o protocolo basico de desintoxicacao do corpo. Adicione 10ml de CDS 0,3% em 1 litro de agua. Divida em 8-10 doses iguais e tome uma dose a cada hora ao longo do dia. Comece com 2-3ml e aumente gradualmente. Faca por no minimo 21 dias. E o protocolo mais usado e indicado para iniciantes.',
    category: 'protocolo',
    tags: ['protocolo-c', 'desintoxicacao', 'basico'],
  },
  {
    question: 'O que e o Protocolo 101 e quando usar?',
    answer: 'O Protocolo 101 e usado para infeccoes agudas (gripe, resfriado, infeccoes urinarias, etc). Consiste em tomar 1ml de CDS em 100ml de agua a cada 15 minutos durante as primeiras 2 horas, depois a cada 30 minutos por mais 2 horas, e entao a cada hora ate completar 8 horas. E um protocolo intensivo para situacoes agudas.',
    category: 'protocolo',
    tags: ['protocolo-101', 'infeccao', 'agudo'],
  },
  {
    question: 'O que e o Protocolo 1000 e para que serve?',
    answer: 'O Protocolo 1000 e um protocolo intensivo de 21 dias para condicoes cronicas e mais graves. Consiste em tomar 1ml de CDS ativado (MMS) a cada hora, 8 vezes por dia, durante 21 dias seguidos. E mais forte que o Protocolo C e indicado para quem ja tem experiencia com CDS. Recomenda-se orientacao profissional.',
    category: 'protocolo',
    tags: ['protocolo-1000', 'cronico', 'intensivo'],
  },
  {
    question: 'Existe protocolo para problemas de pele?',
    answer: 'Sim, o Protocolo D (Dermatologico). Aplique CDS diluido diretamente na area afetada usando uma gaze ou spray. A concentracao varia: para pele sensivel, dilua 1:10 (1 parte CDS para 10 de agua). Para areas mais resistentes, pode usar concentracoes maiores. Deixe agir por 30-60 segundos e enxague. Pode-se repetir 2-3 vezes ao dia.',
    category: 'protocolo',
    tags: ['protocolo-d', 'pele', 'topico'],
  },
  {
    question: 'Qual protocolo usar para dor de dente ou problemas bucais?',
    answer: 'Use o Protocolo E (Enxague Bucal). Dilua 2-3ml de CDS em meio copo de agua. Faca bochechos de 30 segundos a 1 minuto, 3 vezes ao dia. Nao engula. Para dor de dente aguda, pode-se aplicar CDS puro com um algodao diretamente no dente afetado por alguns segundos. Ajuda em gengivite, aftas e infeccoes bucais.',
    category: 'protocolo',
    tags: ['protocolo-e', 'bucal', 'dente'],
  },
  {
    question: 'Como usar CDS para problemas respiratorios?',
    answer: 'Use o Protocolo H (Inalacao). Adicione 1-2ml de CDS em um copo de agua quente (nao fervendo) e inale o vapor suavemente pela boca e nariz por 1-2 minutos. Repita 2-3 vezes ao dia. Cuidado para nao inalar em excesso - deve ser suave. Indicado para sinusite, bronquite e problemas respiratorios. Combine com o Protocolo C oral.',
    category: 'protocolo',
    tags: ['protocolo-h', 'inalacao', 'respiratorio'],
  },

  // === DOSAGEM ===
  {
    question: 'Qual a dosagem de CDS para criancas?',
    answer: 'Para criancas, a dosagem e calculada pelo peso: 0,5ml de CDS por quilo de peso corporal, diluido em agua, dividido em 8-10 doses ao longo do dia. Exemplo: crianca de 20kg = 10ml de CDS em 500ml de agua. Sempre comece com metade da dose e aumente gradualmente. Criancas menores de 2 anos devem ter acompanhamento especial.',
    category: 'dosagem',
    tags: ['crianca', 'pediatrico', 'peso'],
  },
  {
    question: 'Qual a dosagem padrao de CDS para adultos?',
    answer: 'A dosagem padrao para adultos no Protocolo C e 10ml de CDS 0,3% em 1 litro de agua por dia, dividido em 8-10 doses horarias. Para iniciantes, comece com 2-3ml e aumente 1-2ml por dia ate chegar a 10ml. Pessoas com mais de 80kg podem usar ate 12-15ml. Observe sempre as reacoes do corpo.',
    category: 'dosagem',
    tags: ['adulto', 'padrao'],
  },
  {
    question: 'Qual a dosagem para idosos?',
    answer: 'Para idosos, recomenda-se comecar com doses ainda mais baixas: 1-2ml de CDS em 1 litro de agua. Aumente muito gradualmente (0,5ml a cada 2-3 dias). Idosos podem ter reacoes de desintoxicacao mais fortes, entao a paciencia e fundamental. A dose maxima para idosos costuma ser 8-10ml por dia. Mantenha boa hidratacao.',
    category: 'dosagem',
    tags: ['idoso', 'terceira-idade'],
  },
  {
    question: 'O que fazer se sentir nausea com CDS?',
    answer: 'Nausea e um sinal de desintoxicacao rapida demais. Reduza a dose pela metade imediatamente. Tome bastante agua pura. Espere os sintomas passarem antes de retomar. Quando retomar, use a dose reduzida por 2-3 dias antes de aumentar novamente. Se a nausea persistir mesmo com dose baixa, faca uma pausa de 1-2 dias.',
    category: 'dosagem',
    tags: ['efeito-colateral', 'nausea', 'ajuste'],
  },

  // === PREPARO ===
  {
    question: 'Como preparar o CDS em casa?',
    answer: 'Para preparar CDS: 1) Ative 10 gotas de clorito de sodio 28% com 10 gotas de acido cloridrico 4% em um copo pequeno. 2) Coloque esse copo ativado dentro de um pote de vidro fechado com 200ml de agua destilada gelada. 3) Aguarde 12-24 horas na geladeira. 4) O gas sera absorvido pela agua. 5) A solucao ficara amarela (3000ppm aprox). 6) Dilua para 0,3% (3000ppm) se necessario.',
    category: 'preparo',
    tags: ['producao', 'caseiro', 'receita'],
  },
  {
    question: 'Como armazenar o CDS corretamente?',
    answer: 'Armazene o CDS em frasco de vidro escuro (ambar ou azul) com tampa bem vedada. Mantenha SEMPRE na geladeira (2-8 graus). Proteja da luz solar. O CDS perde potencia com calor e luz. Bem armazenado, dura de 1 a 2 meses. Verifique periodicamente a cor (deve ser amarelo claro) e o cheiro (cloro suave). Se ficar incolor, perdeu a eficacia.',
    category: 'preparo',
    tags: ['armazenamento', 'conservacao', 'validade'],
  },
  {
    question: 'Posso usar agua da torneira para diluir o CDS?',
    answer: 'O ideal e usar agua mineral ou filtrada para diluir o CDS no consumo diario. Evite agua da torneira pois o cloro e outros quimicos podem reagir com o CDS. Para o preparo do CDS concentrado, use sempre agua destilada. Nunca use agua quente pois o calor libera o gas e reduz a concentracao.',
    category: 'preparo',
    tags: ['agua', 'diluicao'],
  },
  {
    question: 'Como saber se meu CDS esta na concentracao correta?',
    answer: 'O CDS padrao tem concentracao de 3000ppm (0,3%). Voce pode verificar com tiras reagentes de cloro ou um medidor digital de ORP. Visualmente, o CDS 3000ppm tem cor amarelo claro. Se estiver muito escuro, esta concentrado demais. Se estiver quase transparente, esta fraco. A forma mais precisa e usar um kit de teste de dioxido de cloro.',
    category: 'preparo',
    tags: ['concentracao', 'teste', 'qualidade'],
  },

  // === SEGURANCA ===
  {
    question: 'Posso tomar CDS junto com medicamentos?',
    answer: 'NAO tome CDS junto com medicamentos. Mantenha um intervalo MINIMO de 2 horas entre o CDS e qualquer medicamento. O CDS pode oxidar e neutralizar o efeito dos remedios. Para medicamentos de uso continuo, tome o remedio logo ao acordar, espere 2 horas, e entao comece o CDS. A ultima dose de CDS deve ser 2 horas antes do proximo medicamento.',
    category: 'seguranca',
    tags: ['medicamento', 'interacao', 'intervalo'],
  },
  {
    question: 'Quais sao as contraindicacoes do CDS?',
    answer: 'Principais contraindicacoes: 1) Gestantes e lactantes (por precaucao). 2) Pacientes com deficiencia de G6PD (favismo). 3) Pessoas em quimioterapia ativa (aguardar termino). 4) Alergia conhecida ao dioxido de cloro. 5) Transplantados em uso de imunossupressores (pode interferir). Em todos esses casos, consulte um profissional antes de usar.',
    category: 'seguranca',
    tags: ['contraindicacao', 'restricao', 'cuidado'],
  },
  {
    question: 'O CDS pode causar efeitos colaterais?',
    answer: 'Os efeitos mais comuns sao sinais de desintoxicacao (reacao de Herxheimer): nausea leve, diarreia, dor de cabeca, cansaco. Isso indica que o corpo esta eliminando toxinas. Solucao: reduza a dose. Efeitos menos comuns: irritacao gastrica se tomado em jejum prolongado. O CDS em doses adequadas e considerado seguro. Sempre comece com doses baixas.',
    category: 'seguranca',
    tags: ['efeito-colateral', 'herxheimer', 'desintoxicacao'],
  },
  {
    question: 'Vitamina C neutraliza o CDS?',
    answer: 'Sim! Vitamina C (acido ascorbico) e um antioxidante que neutraliza o efeito oxidante do CDS. Mantenha intervalo de pelo menos 2 horas entre CDS e alimentos/suplementos ricos em vitamina C. Evite suco de laranja, limao, acerola, kiwi e suplementos de vitamina C durante o uso do CDS. Prefira tomar vitamina C a noite, apos terminar as doses de CDS.',
    category: 'seguranca',
    tags: ['vitamina-c', 'antioxidante', 'interacao'],
  },

  // === ANIMAIS ===
  {
    question: 'Posso dar CDS para cachorro?',
    answer: 'Sim, CDS pode ser usado em caes. A dosagem e por peso: 0,5ml de CDS por quilo de peso, diluido em agua, dividido em 3-4 doses ao dia. Exemplo: cao de 10kg = 5ml de CDS em 200ml de agua. Pode ser misturado na agua do bebedouro ou dado com seringa oral. Comece com metade da dose e observe. Funciona bem para infeccoes, cinomose e problemas de pele.',
    category: 'animais',
    tags: ['cachorro', 'cao', 'dosagem-animal'],
  },
  {
    question: 'Como usar CDS em gatos?',
    answer: 'Gatos sao mais sensiveis que caes. Use 0,3ml de CDS por quilo de peso, diluido em agua, dividido em 2-3 doses ao dia. Exemplo: gato de 4kg = 1,2ml de CDS em 100ml de agua. Administre com seringa oral pequena. Comece com 1/4 da dose e aumente gradualmente. Gatos podem rejeitar pelo sabor - misturar com um pouco de caldo de frango natural pode ajudar.',
    category: 'animais',
    tags: ['gato', 'felino', 'dosagem-animal'],
  },
  {
    question: 'CDS funciona para cinomose em cachorro?',
    answer: 'Sim, ha muitos relatos de sucesso com CDS no tratamento de cinomose canina. Use o protocolo intensivo: 0,5ml/kg dividido em doses a cada 2 horas nas primeiras 48 horas. Depois, reduza para doses a cada 4 horas por mais 5-7 dias. Mantenha o animal hidratado. O CDS nao substitui o veterinario - use como tratamento complementar. Resultados costumam aparecer em 3-5 dias.',
    category: 'animais',
    tags: ['cinomose', 'cachorro', 'tratamento'],
  },
];

async function seed() {
  console.log('Populando base de conhecimento...\n');

  let inserted = 0;
  let skipped = 0;

  for (const entry of SEED_DATA) {
    // Verificar se ja existe pergunta similar
    const { data: existing } = await supabase
      .from('knowledge_base')
      .select('id')
      .ilike('question', `%${entry.question.slice(0, 40)}%`)
      .limit(1);

    if (existing && existing.length > 0) {
      console.log(`  [SKIP] ${entry.question.slice(0, 60)}...`);
      skipped++;
      continue;
    }

    const { error } = await supabase.from('knowledge_base').insert({
      ...entry,
      status: 'approved',
      asked_by: 'system',
      approved_at: new Date().toISOString(),
    });

    if (error) {
      console.error(`  [ERRO] ${entry.question.slice(0, 40)}: ${error.message}`);
    } else {
      console.log(`  [OK] ${entry.question.slice(0, 60)}`);
      inserted++;
    }
  }

  console.log(`\nResultado: ${inserted} inseridas, ${skipped} ja existiam.`);
  console.log('Total de entries:', SEED_DATA.length);
}

seed().catch(console.error);
