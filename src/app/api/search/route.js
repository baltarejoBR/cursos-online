import { NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase-admin';
import { PRODUCTS } from '@/lib/products';

// Páginas e conteúdos do site para busca
const SITE_PAGES = [
  // === PÁGINAS PRINCIPAIS ===
  { id: 'page-inicio', title: 'Início', description: 'Página inicial do Método Corpo Limpo', url: '/', keywords: 'home inicio principal' },
  { id: 'page-o-que-e-cds', title: 'O que é Dioxi / CDS?', description: 'Entenda o que é o CDS, como funciona a oxidação seletiva, diferença para água sanitária, MMS vs CDS, biofilmes e reação de Herxheimer', url: '/o-que-e-cds', keywords: 'cds dioxido cloro dioxi sdc o que e como funciona oxidacao seletiva biofilme herxheimer mms agua sanitaria potencial oxidacao clo2' },
  { id: 'page-depoimentos', title: 'Depoimentos', description: 'Depoimentos de alunos e usuários sobre CDS — geral, câncer, pele, animais, circulação e recuperação', url: '/depoimentos', keywords: 'depoimentos testemunhos relatos experiencias alunos cancer pele animais circulacao recuperacao' },
  { id: 'page-planos', title: 'Cursos e Livros', description: 'Catálogo completo de cursos, livros, consultoria e materiais gratuitos', url: '/planos', keywords: 'cursos livros planos catalogo comprar preco' },
  { id: 'page-loja', title: 'Loja - Comprar Produtos', description: 'SDC, Ormus, DMSO e kits completos para Terapias Bio-oxidativas', url: '/loja', keywords: 'loja comprar produtos sdc ormus dmso kit clo2br' },
  { id: 'page-nossos-produtos', title: 'Nossos Produtos — SDC, Ormus e DMSO', description: 'Comparação detalhada entre SDC/CDS (3000ppm), Ormus (minerais monoatômicos) e DMSO (dimetilsulfóxido). Preços e opções de compra.', url: '/loja/nossos-produtos', keywords: 'sdc cds ormus dmso dimetilsulfoxido 3000ppm minerais monoatomicos comparacao diferenca preco comprar pet vidro' },
  { id: 'page-login', title: 'Entrar', description: 'Faça login na sua conta', url: '/login', keywords: 'login entrar conta acesso' },
  { id: 'page-cadastro', title: 'Cadastrar', description: 'Crie sua conta no Método Corpo Limpo', url: '/cadastro', keywords: 'cadastro registrar criar conta' },
  { id: 'page-minha-area', title: 'Minha Área', description: 'Acesse seus cursos e conteúdos adquiridos', url: '/minha-area', keywords: 'minha area dashboard painel cursos comprados' },
  { id: 'page-mentoria', title: 'Consultoria Individual em CDS', description: 'Consultoria por Zoom (até 1h30) com Gabriel Baltarejo + 30 dias de acompanhamento por WhatsApp. Protocolos personalizados.', url: '/produto/mentoria', keywords: 'consultoria mentoria individual personalizada gabriel baltarejo zoom whatsapp acompanhamento protocolo personalizado' },

  // === UNIVERSIDADE DIOXI ===
  { id: 'page-universidade', title: 'Universidade Dioxi', description: 'Conteúdo educacional gratuito e premium sobre CDS e Terapias Bio-oxidativas. Artigos para iniciantes, protocolos, ciência, estudos científicos e segurança.', url: '/universidade', keywords: 'universidade dioxi aprender gratuito iniciantes conteudo artigos educacao terapias bio-oxidativas' },
  { id: 'uni-iniciantes', title: 'Universidade — Conteúdo para Iniciantes', description: 'Artigos introdutórios gratuitos sobre CDS para quem está começando', url: '/universidade?category=iniciantes', keywords: 'iniciantes basico introducao comecar aprender cds gratuito' },
  { id: 'uni-ciencia', title: 'Universidade — Ciência', description: 'Artigos científicos sobre dióxido de cloro e terapias bio-oxidativas', url: '/universidade?category=ciencia', keywords: 'ciencia cientifica dioxido cloro pesquisa artigos evidencias' },
  { id: 'uni-estudos', title: 'Universidade — Estudos Científicos', description: 'Ensaios clínicos, peer reviews, revisões e estudos sobre CDS — COVID-19, câncer, sangue, pele, infecções', url: '/universidade?category=estudos', keywords: 'estudos cientificos ensaios clinicos peer review revisoes covid cancer sangue oxigenio pele queimaduras infeccoes toxicidade' },
  { id: 'uni-seguranca', title: 'Universidade — Segurança', description: 'Informações sobre segurança, dosagens corretas e cuidados ao usar CDS', url: '/universidade?category=seguranca', keywords: 'seguranca dosagem cuidados efeitos colaterais contra indicacao seguro' },

  // === PROTOCOLOS (Gratuitos) ===
  { id: 'proto-a', title: 'Protocolo A — Iniciante', description: 'Protocolo inicial para quem está começando com CDS. Dosagens leves e progressivas para adaptação do corpo.', url: '/universidade?category=protocolos&protocol=protocolo-a-iniciante', keywords: 'protocolo a iniciante basico comecar dosagem leve progressivo adaptacao primeiro' },
  { id: 'proto-c', title: 'Protocolo C — Padrão', description: 'Protocolo padrão de uso diário do CDS. O mais utilizado para manutenção da saúde e detox geral.', url: '/universidade?category=protocolos&protocol=protocolo-c-padrao', keywords: 'protocolo c padrao diario manutencao saude detox geral uso continuo' },
  { id: 'proto-d', title: 'Protocolo D — Pele', description: 'Protocolo para aplicação tópica do CDS na pele. Indicado para problemas dermatológicos.', url: '/universidade?category=protocolos&protocol=protocolo-d-pele', keywords: 'protocolo d pele topico dermatologico aplicacao cutanea feridas manchas acne dermatite eczema' },
  { id: 'proto-e', title: 'Protocolo E — Enemas', description: 'Protocolo de enemas com CDS para limpeza intestinal e detox profundo.', url: '/universidade?category=protocolos&protocol=protocolo-e-enemas', keywords: 'protocolo e enema enemas intestinal limpeza detox profundo lavagem intestino retal' },
  { id: 'proto-k', title: 'Protocolo K — DMSO', description: 'Protocolo combinando CDS com DMSO para potencializar a absorção e o efeito terapêutico.', url: '/universidade?category=protocolos&protocol=protocolo-k-dmso', keywords: 'protocolo k dmso dimetilsulfoxido absorcao potencializar combinacao transdermica' },

  // === PROTOCOLOS (Premium) ===
  { id: 'proto-b', title: 'Protocolo B — Banho', description: 'Protocolo de banho com CDS para absorção pela pele e detox corporal completo.', url: '/universidade?category=protocolos&protocol=protocolo-b-banho', keywords: 'protocolo b banho imersao pele absorção detox corporal premium' },
  { id: 'proto-f', title: 'Protocolo F — Febre', description: 'Protocolo específico para situações de febre usando CDS.', url: '/universidade?category=protocolos&protocol=protocolo-f-febre', keywords: 'protocolo f febre temperatura infeccao gripe resfriado premium' },
  { id: 'proto-g', title: 'Protocolo G — Gás', description: 'Protocolo de inalação de gás CDS em baixas concentrações.', url: '/universidade?category=protocolos&protocol=protocolo-g-gas', keywords: 'protocolo g gas inalacao respiratorio pulmao baixa concentracao premium' },
  { id: 'proto-h', title: 'Protocolo H — Ambiente', description: 'Protocolo de uso ambiental do CDS para purificação de espaços.', url: '/universidade?category=protocolos&protocol=protocolo-h-ambiente', keywords: 'protocolo h ambiente purificacao espaco desinfeccao casa ambiente premium' },
  { id: 'proto-i', title: 'Protocolo I — Picadas', description: 'Protocolo para picadas de insetos, aranhas e animais peçonhentos.', url: '/universidade?category=protocolos&protocol=protocolo-i-picadas', keywords: 'protocolo i picadas inseto aranha peconhento mordida veneno premium' },
  { id: 'proto-j', title: 'Protocolo J — Boca', description: 'Protocolo para saúde bucal — bochecho e aplicação oral com CDS.', url: '/universidade?category=protocolos&protocol=protocolo-j-boca', keywords: 'protocolo j boca bucal bochecho oral dente gengiva carie gengivite premium' },
  { id: 'proto-l', title: 'Protocolo L — Lavapés', description: 'Protocolo de lavapés com CDS para absorção pelos pés e desintoxicação.', url: '/universidade?category=protocolos&protocol=protocolo-l-lavapes', keywords: 'protocolo l lavapes pes escalda pe absorcao desintoxicacao premium' },
  { id: 'proto-m', title: 'Protocolo M — Malária', description: 'Protocolo intensivo para malária usando CDS.', url: '/universidade?category=protocolos&protocol=protocolo-m-malaria', keywords: 'protocolo m malaria intensivo tropical parasita premium' },
  { id: 'proto-n', title: 'Protocolo N — Crianças', description: 'Protocolo adaptado para crianças com dosagens específicas por peso e idade.', url: '/universidade?category=protocolos&protocol=protocolo-n-criancas', keywords: 'protocolo n criancas infantil pediatrico dosagem peso idade bebe premium' },
  { id: 'proto-o', title: 'Protocolo O — Olhos e Nariz', description: 'Protocolo para aplicação oftálmica e nasal com CDS diluído.', url: '/universidade?category=protocolos&protocol=protocolo-o-olhos-nariz', keywords: 'protocolo o olhos nariz oftalmico nasal colírio gotas sinusite rinite conjuntivite premium' },
  { id: 'proto-p', title: 'Protocolo P — Parasitas', description: 'Protocolo antiparasitário completo com CDS para eliminação de parasitas intestinais e vermes.', url: '/universidade?category=protocolos&protocol=protocolo-p-parasitas', keywords: 'protocolo p parasitas vermes antiparasitario intestinal lombriga ascaris oxiurus tenia giárdia premium' },
  { id: 'proto-q', title: 'Protocolo Q — Queimaduras', description: 'Protocolo para tratamento de queimaduras com CDS — aplicação tópica.', url: '/universidade?category=protocolos&protocol=protocolo-q-queimaduras', keywords: 'protocolo q queimaduras queimadura topico cicatrizacao pele premium' },
  { id: 'proto-r', title: 'Protocolo R — Retal', description: 'Protocolo retal com CDS para aplicação via enema específico.', url: '/universidade?category=protocolos&protocol=protocolo-r-retal', keywords: 'protocolo r retal enema aplicacao via retal intestino premium' },
  { id: 'proto-s', title: 'Protocolo S — Sensível', description: 'Protocolo para pessoas com sensibilidade elevada — dosagens ultra-baixas e progressão lenta.', url: '/universidade?category=protocolos&protocol=protocolo-s-sensivel', keywords: 'protocolo s sensivel sensibilidade baixa dosagem lento gradual suave premium' },
  { id: 'proto-t', title: 'Protocolo T — Terminal', description: 'Protocolo intensivo para casos graves e terminais com acompanhamento.', url: '/universidade?category=protocolos&protocol=protocolo-t-terminal', keywords: 'protocolo t terminal grave intensivo cancer doença cronica premium' },
  { id: 'proto-u', title: 'Protocolo U — Urgência', description: 'Protocolo de urgência com CDS para situações agudas que precisam de ação rápida.', url: '/universidade?category=protocolos&protocol=protocolo-u-urgencia', keywords: 'protocolo u urgencia emergencia agudo rapido acao imediata premium' },
  { id: 'proto-v', title: 'Protocolo V — Vaginal', description: 'Protocolo vaginal com CDS para saúde íntima feminina.', url: '/universidade?category=protocolos&protocol=protocolo-v-vaginal', keywords: 'protocolo v vaginal feminino intimo candidiase infeccao ginecologico premium' },
  { id: 'proto-w', title: 'Protocolo W — Usos Diversos', description: 'Protocolo para usos variados do CDS não cobertos por outros protocolos.', url: '/universidade?category=protocolos&protocol=protocolo-w-usos-diversos', keywords: 'protocolo w diversos variados outros usos aplicacoes premium' },
  { id: 'proto-x', title: 'Protocolo X — Íntimo', description: 'Protocolo para higiene e saúde íntima com CDS.', url: '/universidade?category=protocolos&protocol=protocolo-x-intimo', keywords: 'protocolo x intimo higiene saude intima premium' },
  { id: 'proto-y', title: 'Protocolo Y — Intravenoso', description: 'Protocolo intravenoso com CDS — uso supervisionado por profissional de saúde.', url: '/universidade?category=protocolos&protocol=protocolo-y-intravenoso', keywords: 'protocolo y intravenoso iv veia profissional supervisionado premium' },
  { id: 'proto-z', title: 'Protocolo Z — Frequências', description: 'Protocolo combinando CDS com terapia de frequências.', url: '/universidade?category=protocolos&protocol=protocolo-z-frequencias', keywords: 'protocolo z frequencias frequencia terapia vibracao rife premium' },

  // === DESPARASITAÇÃO ===
  { id: 'page-desparasitacao', title: 'Desparasitação Lunar', description: 'Programa completo de desparasitação sincronizado com ciclos da lua nova. 4 fases: preparação, intensiva, estendida e integração. Inclui lista de compras.', url: '/desparasitacao', keywords: 'desparasitacao lunar protocolo p parasitas vermes lua nova ciclo antiparasitario pirantel mebendazol terra diatomacea enema oleo ricino neem epazote quebra pedra agua mar' },

  // === TEAMOR ===
  { id: 'page-teamor', title: 'TEAmor — Curso para Famílias TEA', description: 'Curso completo para famílias com crianças com TEA e desenvolvimento atípico. Módulos: hidratação, dieta, desparasitação, fungos, regeneração intestinal, detox, quelação de metais, desinflamação e ativação neural.', url: '/teamor', keywords: 'teamor tea autismo criancas atipicas familias hidratacao dieta desparasitacao fungos bacterias regeneracao intestinal detox quelacao metais desinflamacao ativacao neural desenvolvimento aline russo' },

  // === CONCEITOS CIENTÍFICOS (página O que é CDS) ===
  { id: 'conceito-oxidacao', title: 'Oxidação Seletiva do CDS', description: 'O CDS (ClO₂) tem potencial de oxidação de apenas 0.95V — muito menor que ozônio (2.07V) ou água oxigenada (1.78V). Isso permite oxidação seletiva de patógenos sem danificar células saudáveis.', url: '/o-que-e-cds', keywords: 'oxidacao seletiva potencial volt clo2 ozonio agua oxigenada hipoclorito patogenos celulas saudaveis' },
  { id: 'conceito-biofilme', title: 'Biofilmes e CDS', description: 'O dióxido de cloro consegue penetrar e destruir biofilmes — camadas protetoras que bactérias e parasitas criam para se proteger de antibióticos.', url: '/o-que-e-cds', keywords: 'biofilme biofilmes bacteria parasita camada protetora antibiotico resistencia penetrar destruir' },
  { id: 'conceito-herxheimer', title: 'Reação de Herxheimer', description: 'Reação temporária de desintoxicação que pode ocorrer quando o CDS elimina patógenos. Sintomas incluem mal-estar, dor de cabeça e cansaço — sinal de que o corpo está limpando toxinas.', url: '/o-que-e-cds', keywords: 'herxheimer reacao desintoxicacao detox sintomas mal estar dor cabeca cansaco toxinas limpeza die-off' },
  { id: 'conceito-mms-cds', title: 'Diferença entre MMS e CDS', description: 'MMS é clorito de sódio ativado com ácido — o CDS/SDC é a evolução: apenas o gás ClO₂ dissolvido em água, sem resíduo ácido.', url: '/o-que-e-cds', keywords: 'mms cds diferenca clorito sodio acido gas clo2 agua evolucao jim humble andreas kalcker' },
];

// GET /api/search?q=termo&type=all|produtos|blog|conhecimento|paginas&mode=text|ai
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();
  const type = searchParams.get('type') || 'all';
  const mode = searchParams.get('mode') || 'text';

  if (!query || query.length < 2) {
    return NextResponse.json({ error: 'Busca deve ter ao menos 2 caracteres' }, { status: 400 });
  }

  const supabase = createAdminSupabase();
  const results = {};
  const searchLower = query.toLowerCase();

  // Normalizar texto removendo acentos
  const normalize = (str) =>
    str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const normalizedQuery = normalize(query);

  // --- Busca em Produtos (client-side, do JS) ---
  if (type === 'all' || type === 'produtos') {
    const prodResults = PRODUCTS.filter((p) => {
      if (p.hidden) return false;
      const searchable = normalize(
        `${p.title} ${p.subtitle} ${p.description} ${p.category} ${(p.features || []).join(' ')}`
      );
      return normalizedQuery.split(/\s+/).every((word) => searchable.includes(normalize(word)));
    }).map((p) => ({
      id: p.id,
      type: 'produto',
      title: p.title,
      subtitle: p.subtitle,
      description: p.description.slice(0, 150) + (p.description.length > 150 ? '...' : ''),
      url: p.type === 'external' ? p.externalUrl : `/produto/${p.slug}`,
      image: p.image,
      price: p.priceDisplay || null,
      badge: p.badge || null,
      category: p.category,
    }));
    results.produtos = prodResults;
  }

  // --- Busca em Páginas do site ---
  if (type === 'all' || type === 'paginas') {
    const pageResults = SITE_PAGES.filter((p) => {
      const searchable = normalize(`${p.title} ${p.description} ${p.keywords}`);
      return normalizedQuery.split(/\s+/).every((word) => searchable.includes(normalize(word)));
    }).map((p) => ({
      id: p.id,
      type: 'pagina',
      title: p.title,
      description: p.description,
      url: p.url,
      image: null,
      category: 'pagina',
    }));
    results.paginas = pageResults;
  }

  // --- Busca em Blog Posts ---
  if (type === 'all' || type === 'blog') {
    try {
      const { data: blogPosts } = await supabase
        .from('blog_posts')
        .select('id, slug, title, excerpt, category, cover_image, reading_time_minutes, published_at')
        .eq('published', true)
        .or(`title.ilike.%${searchLower}%,excerpt.ilike.%${searchLower}%,category.ilike.%${searchLower}%`)
        .order('published_at', { ascending: false })
        .limit(10);

      results.blog = (blogPosts || []).map((p) => ({
        id: p.id,
        type: 'blog',
        title: p.title,
        description: p.excerpt || '',
        url: `/blog/${p.slug}`,
        image: p.cover_image,
        category: p.category,
        readingTime: p.reading_time_minutes,
        date: p.published_at,
      }));
    } catch {
      results.blog = [];
    }
  }

  // --- Busca na Base de Conhecimento ---
  if (type === 'all' || type === 'conhecimento') {
    try {
      // Tentar busca fuzzy primeiro
      const { data: kbResults, error: kbError } = await supabase.rpc('search_knowledge_base', {
        search_query: query,
        min_similarity: 0.2,
        max_results: 10,
        filter_category: null,
      });

      if (kbError) {
        // Fallback ILIKE
        const { data: fallback } = await supabase
          .from('knowledge_base')
          .select('id, question, answer, category, tags')
          .eq('status', 'approved')
          .or(`question.ilike.%${searchLower}%,answer.ilike.%${searchLower}%`)
          .limit(10);

        results.conhecimento = (fallback || []).map((k) => ({
          id: k.id,
          type: 'conhecimento',
          title: k.question,
          description: k.answer ? k.answer.slice(0, 200) + (k.answer.length > 200 ? '...' : '') : '',
          url: null,
          category: k.category,
          tags: k.tags,
        }));
      } else {
        results.conhecimento = (kbResults || []).map((k) => ({
          id: k.id,
          type: 'conhecimento',
          title: k.question,
          description: k.answer ? k.answer.slice(0, 200) + (k.answer.length > 200 ? '...' : '') : '',
          url: null,
          category: k.category,
          tags: k.tags,
          similarity: k.similarity,
        }));
      }
    } catch {
      results.conhecimento = [];
    }
  }

  // --- Busca Semântica com IA ---
  if (mode === 'ai') {
    try {
      const aiResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/chat`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: query, history: [] }),
        }
      );
      const aiData = await aiResponse.json();
      results.ai = {
        response: aiData.response || null,
      };
    } catch {
      results.ai = { response: null };
    }
  }

  // Contar total de resultados
  const totalResults =
    (results.paginas?.length || 0) +
    (results.produtos?.length || 0) +
    (results.blog?.length || 0) +
    (results.conhecimento?.length || 0);

  return NextResponse.json({
    query,
    mode,
    totalResults,
    results,
  });
}
